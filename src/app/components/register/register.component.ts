import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { User } from '../../model/user';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  name: string;
  email: string;
  password: string;
  isSubmitted: boolean = false;

  registerForm: FormGroup;
  nameCtrl: FormControl;
  emailCtrl: FormControl;
  passCtrl: FormControl;

  constructor(
    private authService: AuthService,
    private matSnackBar: MatSnackBar,
    private router: Router,
  ) { }

  ngOnInit() {
    this.nameCtrl = new FormControl('', Validators.required);
    this.emailCtrl = new FormControl('', [Validators.required, Validators.pattern(EMAIL_REGEX)]);
    this.passCtrl = new FormControl('', Validators.required);

    this.registerForm = new FormGroup({
      name: this.nameCtrl,
      email: this.emailCtrl,
      password: this.passCtrl
    });
  }

  capitalize(str) {
    var wordCount = str.split(' ');
    var upperStr = '';
    for(let x = 0; x <= wordCount.length - 1; x++) {
      if (x > 0) {
        upperStr += ' ';
      }
      upperStr += wordCount[x].charAt(0).toUpperCase() + wordCount[x].slice(1).toLowerCase();
    }

    return upperStr;
  }

  registerSubmit() {
    this.isSubmitted = true;
    if (this.registerForm.valid) {
      this.authService.register(this.email, this.password).then((userData) => {
        if(userData['code']) {
          this.isSubmitted = false;
          this.matSnackBar.open(userData['message'], "close", {duration: 3000});
        }else {
          this.authService.saveUserRegistered(userData['uid'], this.capitalize(this.name), this.email, this.password).then(res => {
            this.authService.sendVerificationEmail().then((emailRes) => {
              this.isSubmitted = false;
              this.name = "";
              this.email = "";
              this.password = "";
              this.router.navigate(['']);
              this.matSnackBar.open("Email verification was sent to your email", "close", {duration: 5000});
            });
          });
        }
      });
    }else {
      this.isSubmitted = false;
      this.matSnackBar.open("Error! some of fields are incorrect", "close", {duration: 3000});
    }
  }
}
