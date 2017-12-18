import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase';
import 'firebase/firestore';

@Injectable()
export class PeopleService {
  db: any = firebase.firestore();
  constructor() { }

  loadPeople() {
    const promise = new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged((user) => {
        let userId = user.uid;

        this.db.collection('users').get().then(users => {
          // resolve(users.key);
          // const peopleObj = users.docs.filter(doc => doc.id != userId);
          resolve(users.docs.filter(doc => doc.id != userId).map(user => user.data()))
          
        });
        // firebase.firestore().collection().doc().get().then(users => {
        //   resolve(users.data());
        // });
      });
    });

    return promise;
  }
}
