import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import { ProfileService } from '../../services/profile.service';
import { User } from '../../model/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  @ViewChild('profilePicUpload') uploadPic: ElementRef;
  user: object;

  constructor(
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog, 
    public snackBar: MatSnackBar,
    private profileService: ProfileService
  ) { }

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.profileService.loadProfile().then(user => {
      this.user = user;
      console.log('user', user);
    });
  }

  editProfile() {
    const dialogRef = this.dialog.open(EditProfileComponent, {
      width: '300px',
      data: { user: this.user}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result == 1) {
        this.loadProfile();
      }
    });
  }

  logout() {
    this.authService.logout().then(() => {
      localStorage.clear();
      this.router.navigate(['/']);
    });
  }

  profileChange(event) {
    this.profileService.uploadPhoto(event.target.files.item(0)).then(res => {
      if(res) {
        this.loadProfile();
        this.snackBar.open('Profile photo was changed', 'close', { duration: 4000 });
      }else {
        this.snackBar.open('Error changing your profile photo', 'close', { duration: 4000 });
      }
    });
  }
}
