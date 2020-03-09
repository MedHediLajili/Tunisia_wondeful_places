import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { UserComponent } from './components/user/user.component';


const routes: Routes = [
  {path: 'admin' , component:  AdminComponent },
  {path: 'user', component: UserComponent},
  {path: '', redirectTo: 'user', pathMatch: 'full'}
];

@NgModule({
  declarations: [],
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ],
})
export class AppRoutingModule { }
