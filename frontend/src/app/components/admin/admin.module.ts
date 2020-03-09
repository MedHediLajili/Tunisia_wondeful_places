import { NgModule ,  NO_ERRORS_SCHEMA , CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


import { MaterialModule } from 'src/app/material/material.module';
import { UserModule } from '../user/user.module' ;
import { MDBBootstrapModule } from 'angular-bootstrap-md';



import { AjouterLieuComponent } from './ajouter-lieu/ajouter-lieu.component';
import { EditerLieuComponent } from './editer-lieu/editer-lieu.component';
import { ListeEtatsComponent } from './liste-etats/liste-etats.component';
import { ListeLieuxComponent } from './liste-lieux/liste-lieux.component';
import { AdminComponent } from './admin.component';
import { ToolbarComponent } from './adminmanager/toolbar/toolbar.component';
import { MainContentComponent } from './adminmanager/main-content/main-content.component';
import { SidenavComponent } from './adminmanager/sidenav/sidenav.component';
import { ListeUsersComponent } from './liste-users/liste-users.component';
import { AjouterEtatComponent } from './ajouter-etat/ajouter-etat.component';
import { EditerEtatComponent } from './editer-etat/editer-etat.component';
import { AdminloginComponent } from './adminlogin/adminlogin.component';
import { AdminregisterComponent } from './adminregister/adminregister.component';

const adminRoutes: Routes = [
  {path: 'admin' , component: AdminloginComponent},
  {path: 'admin/register', component: AdminregisterComponent },
  {path: 'admin/home' , component: AdminComponent ,
  children: [
    {path: 'ajouterlieu', component: AjouterLieuComponent},
    {path: 'ajouteretat', component: AjouterEtatComponent},
    {path: 'listeusers', component: ListeUsersComponent},
    {path: 'listelieux', component: ListeLieuxComponent},
    {path: 'listeetats', component: ListeEtatsComponent},
    {path: '', component: MainContentComponent}
  ]},
  {path: 'editerlieu', component: EditerLieuComponent},
  /*{path: '', redirectTo: 'adminlogin', pathMatch: 'full'}*/

];


@NgModule({
  declarations: [
    AjouterLieuComponent,
    EditerLieuComponent,
    ListeEtatsComponent,
    ListeLieuxComponent,
    AdminComponent,
    ToolbarComponent,
    MainContentComponent,
    SidenavComponent,
    ListeUsersComponent,
    AjouterEtatComponent,
    EditerEtatComponent,
    AdminloginComponent,
    AdminregisterComponent,

  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MDBBootstrapModule.forRoot(),
    MaterialModule,
    RouterModule.forChild(adminRoutes),
    UserModule
  ],
  exports: [
    AjouterLieuComponent,
    EditerLieuComponent,
    ListeEtatsComponent,
    ListeLieuxComponent,
    AdminloginComponent,
    AdminregisterComponent
  ],
  providers: [],
  schemas: [ NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA ],
  entryComponents: [EditerEtatComponent , EditerLieuComponent],

})
export class AdminModule { }
