import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

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
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.emailCtrl = new FormControl('', [Validators.required, Validators.pattern(EMAIL_REGEX)]);
    this.passwordCtrl = new FormControl('', Validators.required);

    this.loginForm = new FormGroup({
      email: this.emailCtrl,
      password: this.passwordCtrl
    });
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle().then(userData => {
      this.authService.saveUser(userData).then(response => {
        console.log('response', response);
      });
    });
  }
}
