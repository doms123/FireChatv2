import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog, 
    public snackBar: MatSnackBar
  ) { }

  ngOnInit() {
  }

  editProfile() {
    const dialogRef = this.dialog.open(EditProfileComponent, {
      width: '300px',
      data: {name: 'Dominick Sanchez'}
    });

    dialogRef.afterClosed().subscribe(result => {
      
    });
  }

  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/']);
    });
  }
}
