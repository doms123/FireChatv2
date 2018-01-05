import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  name: string;
  email: string;
  phone: string;
  work: string;
  address: string;
  editProfileForm: FormGroup;
  nameCtrl: FormControl;
  emailCtrl: FormControl;
  phoneCtrl: FormControl;
  workCtrl: FormControl;
  addressCtrl: FormControl;

  constructor(public dialogRef: MatDialogRef<EditProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public snackBar: MatSnackBar,
    public profileService: ProfileService
  ) { }

  ngOnInit() {
    this.nameCtrl = new FormControl('', Validators.required);
    this.emailCtrl = new FormControl('', [Validators.required, Validators.pattern(EMAIL_REGEX)]);
    this.phoneCtrl = new FormControl('');
    this.workCtrl = new FormControl('');
    this.addressCtrl = new FormControl('');

    this.editProfileForm = new FormGroup({
      name: this.nameCtrl,
      email: this.emailCtrl,
      phone: this.phoneCtrl,
      work: this.workCtrl,
      address: this.addressCtrl
    });

    this.name = this.data.user['name'];
    this.email = this.data.user['email'];
    this.phone = this.data.user['phone'];
    this.work = this.data.user['work'];
    this.address = this.data.user['address'];
  }

  editProfile() {
    if(this.editProfileForm.valid) {
      this.profileService.saveUpdate(this.editProfileForm.value).then(res => {
        if(res == 1) {
          this.snackBar.open('Profile information was updated', 'close', { duration: 4000 });
          this.dialogRef.close(1);
        }else {
          this.snackBar.open('Error! updating your profile information', 'close', { duration: 4000 });          
        }
        
      });
    }else {
      this.snackBar.open('Please fill out all the required fields', 'close', {duration: 4000});
    }
  }

  onNoClick(): void { 
    this.dialogRef.close();
  }
}
