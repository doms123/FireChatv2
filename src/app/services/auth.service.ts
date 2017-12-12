import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase';
import 'firebase/firestore';


@Injectable()
export class AuthService {
  db:any = firebase.firestore();
  constructor(
    private http: Http
  ) {

  }

  loginWithGoogle() {
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    const promise = new Promise((resolve, reject) => {
      firebase.auth().signInWithPopup(googleProvider).then(res => {
        let user = res.user;
        let userObj = {
          name: user.displayName,
          email: user.email,
          photo: user.photoURL
        };
        resolve(userObj);
      }).catch(err => {
        resolve(err);
      });
    });

    return promise;
  }

  saveUser(userData:object) {
    const promise = new Promise((resolve, reject) => {
      this.db.collection('users').add(userData).then(res => {
        resolve(res);
      }).catch(err => {
        resolve(err);
      });
    });

    return promise;
  }
}
