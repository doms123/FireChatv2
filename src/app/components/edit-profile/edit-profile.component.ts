import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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
    public snackBar: MatSnackBar
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
  }

  editProfile() {
    if(this.editProfileForm.valid) {
      console.log('valid');
    }else {
      this.snackBar.open('Please fill out all the required fields', 'close', {duration: 4000});
    }
  }

  onNoClick(): void { 
    this.dialogRef.close();
  }
}
