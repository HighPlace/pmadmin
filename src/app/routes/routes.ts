import { LayoutComponent } from '../layout/layout.component';
import { LoginComponent } from './pages/login/login.component';
import { LockComponent } from './pages/lock/lock.component';
import { RegisterComponent } from './pages/register/register.component';
import { ForgetComponent } from './pages/forget/forget.component';
import { MaintenanceComponent } from './pages/maintenance/maintenance.component';
import { Page404Component } from './pages/404/404.component';
import { Page500Component } from './pages/500/500.component';

export const routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'fixedassets/hourse', pathMatch: 'full' },
            { path: 'fixedassets', loadChildren: './fixed-assets/fixed-assets.module#FixedAssetsModule' },
            { path: 'orgstructure', loadChildren: './organization-structure/organization-structure.module#OrganizationStructureModule' },
            { path: 'customservice', loadChildren: './custom-service/custom-service.module#CustomServiceModule' },
            { path: 'chargemanage', loadChildren: './charge-manage/charge-manage.module#chargeManageModule' },
            { path: 'sysmanage', loadChildren: './sys-manage/sys-manage.module#SysManageModule' },
            { path: 'widgets', loadChildren: './widgets/widgets.module#WidgetsModule' },
            { path: 'elements', loadChildren: './elements/elements.module#ElementsModule' },
            { path: 'forms', loadChildren: './forms/forms.module#FormsModule' },
            { path: 'tables', loadChildren: './tables/tables.module#TablesModule' },
            { path: 'maps', loadChildren: './maps/maps.module#MapsModule' },
            { path: 'logics', loadChildren: './logics/logics.module#LogicsModule' },
            { path: 'extras', loadChildren: './extras/extras.module#ExtrasModule' }
        ]
    },
    // 单页不包裹Layout
    { path: 'register', component: RegisterComponent, data: { translate: 'register' } },
    { path: 'login', component: LoginComponent, data: { title: 'login' } },
    { path: 'forget', component: ForgetComponent, data: { translate: 'forget' } },
    { path: 'lock', component: LockComponent, data: { translate: 'lock' } },
    { path: 'maintenance', component: MaintenanceComponent },
    { path: '404', component: Page404Component },
    { path: '500', component: Page500Component },
    { path: '**', redirectTo: 'fixedassets/hourse' }
];
