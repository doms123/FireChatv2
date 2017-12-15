import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import * as firebase from 'firebase';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(
    private router: Router,
  ) { }
  
  canActivate():Promise<boolean> {
    let promise = new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged(user => {
        resolve(user);
      });
    });
  
    return promise.then(user => {
      if (user) {
        if (user['emailVerified']) {
          return true;
        }else {
          this.router.navigate(['']);
          return false;
        }
      }else {
        this.router.navigate(['']);
        return false;
      }
    });
  }
}
