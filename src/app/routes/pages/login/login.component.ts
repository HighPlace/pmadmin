import {Router} from '@angular/router';
import {Component} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {_HttpClient} from '../../../core/services/http.client';
import {Observable} from 'rxjs/Rx';
import {SettingsService} from '@core/services/settings.service';

@Component({
    selector: 'app-pages-login',
    templateUrl: './login.component.html'
})
export class LoginComponent {
    valForm: FormGroup;
    verifyUrl = 'https://host/api/uaa/captcha-image';
    imgSrc = '';
    vcInt: number = 0;

    constructor(public settings: SettingsService,
                private http: _HttpClient,
                fb: FormBuilder,
                private router: Router) {
        this.valForm = fb.group({
            // mail: [null, Validators.compose([Validators.required, Validators.email])],
            userName: [null, Validators.required],
            password: [null, Validators.required],
            verifyCode: [null, [], [this.verifyCodeValidator]],
            remember_me: [null]
        });

        this.imgSrc = this.verifyUrl;
    }

    verifyCodeValidator = (control: FormControl): any => {
        return Observable.create((observer) => {
            if (this.vcInt) {
                clearTimeout(this.vcInt);
            }

            this.vcInt = setTimeout(() => {
                if (control.value) {
                    this.http.get('/uaa/captcha-image-check', {verifyCode: control.value})
                        .subscribe((data: any) => {
                            observer.next(null);
                            observer.complete();
                        }, (err: any) => {
                            if (err.status !== 200) {
                                observer.next({error: true});
                            } else {
                                observer.next(null);
                            }
                            observer.complete();
                        });
                }else {
                    observer.next({error: true, required: true});
                    observer.complete();
                }
            }, 500);

        });
    };

    submit() {
        // tslint:disable-next-line:forin
        for (const i in this.valForm.controls) {
            this.valForm.controls[i].markAsDirty();
        }
        if (this.valForm.valid) {
            console.log('Valid!');
            console.log(this.valForm.value);
            this.router.navigate(['dashboard']);
        }
    }

    getFormControl(name) {
        return this.valForm.controls[name];
    }

    refreshVerifyCode() {
        this.imgSrc = this.verifyUrl + '?' + Date.now();
    }
}
