import { NgModule ,  NO_ERRORS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';

import { MaterialModule } from 'src/app/material/material.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';



import { HeaderComponent } from './header/header.component';
import { FooterComponent, TermsOfUseComponent, DataProtectionComponent, PrivacyComponent } from './footer/footer.component';
import { UserComponent } from './user.component';
import { ImageSlideComponent } from './header/image-slide/image-slide.component';
import { UserregisterComponent } from './userregister/userregister.component';
import { Header1Component } from './header1/header1.component';
import { AllplacesComponent } from './allplaces/allplaces.component';
import { StatesPlacesComponent } from './states-places/states-places.component';
import { CollectionsComponent } from './collections/collections.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ReactionsComponent } from './reactions/reactions.component';
import { AjouterCollectionComponent } from './collections/ajouter-collection/ajouter-collection.component';
import { EditCollectionComponent } from './collections/edit-collection/edit-collection.component';
import { VerifCodeComponent } from './userregister/verif-code/verif-code.component';
import { EditProfilComponent } from './edit-profil/edit-profil.component';


const userRoutes: Routes = [

  {path: 'user/loginregister', component: UserregisterComponent},
  {path: 'user' , component: UserComponent ,
  children: [
    {path: 'editprofil', component: EditProfilComponent},
    {path: 'info/reactions', component: ReactionsComponent },
    {path: 'info/collections', component: CollectionsComponent },
    {path: 'home/states', component: StatesPlacesComponent},
    {path: 'home', component: AllplacesComponent},
    {path: '', component: AllplacesComponent}
  ]},
];



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    UserComponent,
    ImageSlideComponent,
    TermsOfUseComponent,
    DataProtectionComponent,
    PrivacyComponent,
    UserregisterComponent,
    Header1Component,
    AllplacesComponent,
    StatesPlacesComponent,
    CollectionsComponent,
    ReactionsComponent,
    AjouterCollectionComponent,
    EditCollectionComponent,
    VerifCodeComponent,
    EditProfilComponent
  ] ,
  imports: [
    CommonModule,
    MaterialModule,
    MDBBootstrapModule.forRoot(),
    RouterModule.forChild(userRoutes),
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    UserComponent
  ],
  schemas: [ NO_ERRORS_SCHEMA ],
  entryComponents: [TermsOfUseComponent , DataProtectionComponent , VerifCodeComponent, PrivacyComponent, AjouterCollectionComponent ,
     EditCollectionComponent]
})
export class UserModule { }
