import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import * as firebase from 'firebase';

// Material Component Imports
import { 
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatStepperModule,
} from '@angular/material';

// Component Imports
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

// Service Imports
import { AuthService } from './services/auth.service';
import { HomeComponent } from './components/home/home.component';
import { AuthGuardService } from './services/auth-guard.service';

// Project Routes
const appRoutes: Routes = [
  { 
    path: '', 
    component: LoginComponent,
    data: {
      title: 'FireChatv2 | Login' 
    },
    
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'FireChatv2 | Register'
    }
  },
  {
    path: 'home',
    component: HomeComponent,
    data: {
      title: 'FireChatv2 | Home'
    },
    canActivate: [AuthGuardService]
  },
  { path: '**', component: PageNotFoundComponent }
];

// Firebase Setup
const config = {
  apiKey: "AIzaSyCI9qf9mwV5EPF_VDDxQSW0Q8ltLO1cnjI",
  authDomain: "firechatv2.firebaseapp.com",
  databaseURL: "https://firechatv2.firebaseio.com",
  projectId: "firechatv2",
  storageBucket: "firechatv2.appspot.com",
  messagingSenderId: "220814588047"
};
firebase.initializeApp(config);

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatDialogModule,
    RouterModule.forRoot(
      appRoutes,
    ),
    HttpModule
  ],
  providers: [AuthService, AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
