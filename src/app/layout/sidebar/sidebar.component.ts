import { Component } from '@angular/core';
import {Router} from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import {_HttpClient} from '@core/services/http.client';
import { SettingsService } from '@core/services/settings.service';
import { TokenService } from '@core/net/token/token.service';


@Component({
  selector   : 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
    constructor(public settings: SettingsService,
                public http: _HttpClient,
                public msgSrv: NzMessageService,
                private token: TokenService,
                private router: Router) {
    }

    logout() {
        const access_token = this.token.data.access_token;
        this.http.delete('', {
            access_token: access_token,
            client_id: 'browser'
        });
        this.token.logout();
        this.router.navigate(['/login']);
        // window.location.reload(true);
    }
}
