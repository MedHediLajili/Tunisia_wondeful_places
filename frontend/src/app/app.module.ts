import { BrowserModule } from '@angular/platform-browser';
import { NgModule,  NO_ERRORS_SCHEMA  } from '@angular/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';


import {MaterialModule} from './material/material.module';
import { UserModule } from './components/user/user.module' ;
import { AdminModule } from './components/admin/admin.module';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TokensService } from './services/tokens.service';
import { StatesService } from './services/states.service';
import { PlacesService } from './services/places.service';
import { AdherentsService } from './services/adherents.service';
import { ImagesService } from './services/images.service';
import { AdminsService } from './services/admins.service';





@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    MDBBootstrapModule.forRoot(),
    UserModule,
    AdminModule,
    AppRoutingModule,
  ],
  providers: [TokensService , StatesService , PlacesService , AdherentsService, ImagesService, AdminsService],
  schemas: [ NO_ERRORS_SCHEMA ],
  bootstrap: [AppComponent]
})
export class AppModule { }
