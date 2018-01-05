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
import { HomeComponent } from './components/home/home.component';
import { NavComponent } from './components/nav/nav.component';
import { FriendsComponent } from './components/friends/friends.component';
import { PeopleComponent } from './components/people/people.component';
import { AddFriendComponent } from './components/add-friend/add-friend.component';
import { ProfileComponent } from './components/profile/profile.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { ChatComponent } from './components/chat/chat.component';

// Service Imports
import { AuthService } from './services/auth.service';
import { AuthGuardService } from './services/auth-guard.service';
import { PeopleService } from './services/people.service';
import { ProfileService } from './services/profile.service';

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
  {
    path: 'friends',
    component: FriendsComponent,
    data: {
      title: 'FireChatv2 | Friends'
    },
    canActivate: [AuthGuardService]
  },
  {
    path: 'people',
    component: PeopleComponent,
    data: {
      title: 'FireChatv2 | People'
    },
    canActivate: [AuthGuardService]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    data: {
      title: 'FireChatv2 | Profile'
    },
    canActivate: [AuthGuardService]
  },
  {
    path: 'chat/:id',
    component: ChatComponent,
    data: {
      title: 'FireChatv2 | Profile'
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
    NavComponent,
    FriendsComponent,
    PeopleComponent,
    AddFriendComponent,
    ProfileComponent,
    EditProfileComponent,
    ChatComponent,
  ],
  entryComponents: [AddFriendComponent, EditProfileComponent],
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
  providers: [AuthService, AuthGuardService, PeopleService, ProfileService],
  bootstrap: [AppComponent]
})
export class AppModule { }
