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
    private http: Http,
  ) {
    setInterval(() => {
      this.userPresence();
    }, 5000);
  }

  userPresence() {
    firebase.auth().onAuthStateChanged((user) => {
      const userId = user.uid;
      const firestoreUserRef = firebase.firestore().doc(`users/${userId}`);
      const firebaseUserRef = firebase.database().ref(`users/${userId}`);

      firebaseUserRef.set({
        isOnline: true
      });

      firebase.database().ref('.info/connected').on('value', (snapshot) => {
        console.log('snapshot', snapshot.val());
        if(snapshot.val() == false) {
          return;
        }

        firebaseUserRef.onDisconnect().set({
          isOnline: 'false'
        }).then(() => {
         
        });
       
        // userRef.onDisconnect().set(isOfflineForDatabase).then(function () {
        //   // The promise returned from .onDisconnect().set() will
        //   // resolve as soon as the server acknowledges the onDisconnect() 
        //   // request, NOT once we've actually disconnected:
        //   // https://firebase.google.com/docs/reference/js/firebase.database.OnDisconnect

        //   // We can now safely set ourselves as "online" knowing that the
        //   // server will mark us as offline once we lose connection.
        //   userStatusDatabaseRef.set(isOnlineForDatabase);
        // });
      });
    });
  }

  loginWithGoogle() {
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    const promise = new Promise((resolve, reject) => {
      firebase.auth().signInWithPopup(googleProvider).then(res => {
        let user = res.user;
        let userObj = {
          userid: user.uid,
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

  checkIfAccountExist(userid:string) {
    const promise = new Promise((resolve, reject) => {
      this.db.collection('users').doc(userid).get().then(doc => {
        if(doc.exists) {
          resolve(doc.data());
        }else {
          resolve(0);
        }
      });
    });

    return promise;
  }

  saveUser(userData:object) {
    const promise = new Promise((resolve, reject) => {
      firebase.database().ref(`users/${userData['userid']}`).set({
        isOnline: false
      });
      this.db.collection('users').doc(userData['userid']).set(userData).then(res => {
        resolve(res);
      }).catch(err => {
        resolve(err);
      });
    });

    return promise;
  }

  checkUserLoggedIn() {
    let promise = new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged((user) => {
        resolve(user);
      })
    });

    return promise;
  }
  
  loginWithFacebook() {
    const facebookProvider = new firebase.auth.FacebookAuthProvider();
    const promise = new Promise((resolve, reject) => {
      firebase.auth().signInWithPopup(facebookProvider).then((res) => {
        resolve(res.user);
      });
    });

    return promise;
  }

  loginWithUserAndPass(email: string, password: string) {
    const promise = new Promise((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(email, password).then(data => {
        resolve(data);
      }).catch(err => {
        resolve(err);
      });
    });

    return promise;
  }

  register(email: string, password: string) {
    const promise = new Promise((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(email, password).then(user => {
        resolve(user);
      }).catch(err => {
        resolve(err);
      })
    });

    return promise;
  }

  saveUserRegistered(uid: string, name: string, email: string, password: string) {
    const promise = new Promise((resolve, reject) => {
      firebase.database().ref(`users/${uid}`).set({
        isOnline: false
      });
      this.db.collection('users').doc(uid).set({
        name: name,
        email: email,
        password: password,
        photo: ''
      }).then(res => {
        resolve(res);
      }).catch(err => {
        resolve(err);
      });
    });

    return promise;
  }

  sendVerificationEmail() {
    const promise = new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged((user) => {
        user.sendEmailVerification().then(data => {
          resolve(data);
        }).catch(err => {
          resolve(err);
        });
      });
    });

    return promise;
  }

  logout() {
    const promise = new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged((user) => {
        const userId = user.uid;
        const firestoreUserRef = firebase.firestore().doc(`users/${userId}`);
        const firebaseUserRef = firebase.database().ref(`users/${userId}`);

        firebaseUserRef.set({
          isOnline: false
        });
      });

      firebase.auth().signOut().then(res => {
        resolve(res);
      }).catch(err => {
        resolve(err);
      });
    });

    return promise;
  }
}
