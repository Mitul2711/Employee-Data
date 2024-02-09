import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


//fireStore module
import { AngularFireModule } from '@angular/fire/compat';
import { FirestoreModule } from '@angular/fire/firestore'; 
import { environment } from 'src/environments/environment.prod';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { RouterModule, RouterOutlet } from '@angular/router';
import { TableComponent } from './components/table/table.component';
import { MaterialModule } from './module/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';





@NgModule({
  declarations: [
    AppComponent,
 

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    FirestoreModule,
    AngularFireStorageModule,
    RouterModule,
    RouterOutlet,
    MaterialModule,
    TableComponent,
    ReactiveFormsModule,
    FormsModule

  ],
  providers: [],
  exports:[],
  bootstrap: [AppComponent]
})
export class AppModule { }
