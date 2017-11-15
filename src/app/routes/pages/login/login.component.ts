import {Router} from '@angular/router';
import {Component} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {_HttpClient} from '@core/services/http.client';
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
    vcInt = 0;

    constructor(public settings: SettingsService,
                private http: _HttpClient,
                fb: FormBuilder,
                private router: Router) {
        this.valForm = fb.group({
            // mail: [null, Validators.compose([Validators.required, Validators.email])],
            userName: [null, Validators.required],
            password: [null, Validators.required],
            verifyCode: [null, [], [this.verifyCodeValidator]]
        });

        this.imgSrc = this.verifyUrl;
    }

    // todo 1、验证码成功能否返回空对象，body不为空；2、能够区别出验证码错误还是过期
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
                } else {
                    observer.next({error: true, required: true});
                    observer.complete();
                }
            }, 800);

        });
    };

    submit() {
        // tslint:disable-next-line:forin
        for (const i in this.valForm.controls) {
            this.valForm.controls[i].markAsDirty();
        }
        if (this.valForm.valid) {
            const user = this.valForm.value;

            this.http.post('/uaa/oauth/token', {
                scope: 'ui',
                username: user.userName + '|' + user.verifyCode,
                password: user.password,
                grant_type: 'password',
                client_id: 'browser'
            }).subscribe((data: any) => {
                console.log(data);
                this.router.navigate(['']);
            }, (err: any) => {
                console.log(err);
            });
        }
    }

    getFormControl(name) {
        return this.valForm.controls[name];
    }

    refreshVerifyCode() {
        this.imgSrc = this.verifyUrl + '?' + Date.now();
    }
}
