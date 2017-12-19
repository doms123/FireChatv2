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
}
