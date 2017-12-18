import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  is_authenticating: boolean = false;
  loginForm: FormGroup;
  emailCtrl: FormControl;
  passwordCtrl: FormControl;

  constructor(
    private authService: AuthService,
    private router: Router,
    private matSnackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.emailCtrl = new FormControl('', [Validators.required, Validators.pattern(EMAIL_REGEX)]);
    this.passwordCtrl = new FormControl('', Validators.required);

    this.loginForm = new FormGroup({
      email: this.emailCtrl,
      password: this.passwordCtrl
    });

    this.checkUserLoggedIn();
  }

  checkUserLoggedIn() {
    this.authService.checkUserLoggedIn().then(user => {
      if(user) {
        this.router.navigate(['/home']);
      }
    });
  }

  loginWithGoogle() {
    this.is_authenticating = true;
    this.authService.loginWithGoogle().then(userData => {
      console.log('userData', userData);
      this.authService.checkIfAccountExist(userData['userid']).then(status => {
        if (status) { // old user
          this.router.navigate(['/home']);
          this.is_authenticating = false;
        }else { // new user
          this.authService.saveUser(userData).then(response => {
            this.router.navigate(['/home']);
            this.is_authenticating = false;
          });
        }
      });
    });
  }

  loginWithFacebook() {
    this.is_authenticating = true;
    this.authService.loginWithFacebook().then(userData => {
      console.log('userData', userData);
    });
  }

  loginSubmit() {
    this.is_authenticating = true;
    if (this.loginForm.valid) {
      this.authService.loginWithUserAndPass(this.email, this.password).then(user => {
        if(user['code']) {
          this.matSnackBar.open(user['message'], "remove", { duration: 3000 });
        }else {
          if (user['emailVerified']) {
            this.router.navigate(['home']);
          }else {
            this.matSnackBar.open('Login failed! please verify your email first.', "remove", { duration: 3000 });
          }
        }
        this.is_authenticating = false;
      });
    }else {
      this.matSnackBar.open("Incorrect email or password!", "remove", { duration: 3000 });
    }
  }
}
