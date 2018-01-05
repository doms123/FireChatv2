import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import 'firebase/firestore';

@Injectable()
export class ProfileService {

  db: any = firebase.firestore();
  private basePath: string = '/uploads';
  userId: string = localStorage.getItem('user_id');

  constructor() { }

  loadProfile() {
    const promise = new Promise((resolve, reject) => {
      this.db.collection('users').doc(this.userId).get().then(userData => {
        resolve(userData.data());
      }).catch(err => {
        resolve(err);
      });
    });

    return promise;
  }

  uploadPhoto(upload) {
    const promise = new Promise((resolve, reject) => {
      let storageRef = firebase.storage().ref();
      let uploadTask = storageRef.child(`${this.basePath}/${upload.name}`).put(upload);

      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
          upload.progress = (uploadTask.snapshot.bytesTransferred / uploadTask.snapshot.totalBytes) * 100
        },
        (error) => {
          resolve(error);
        },
        () => {
          this.saveFileData(uploadTask.snapshot.downloadURL);
          resolve(1);
        }
      );
    });

    return promise;
  }

  saveFileData(uploadedFilePath) {
    this.db.collection('users').doc(this.userId).update({
      photo: uploadedFilePath
    });
  }

  saveUpdate(user:object) {
    const promise = new Promise((resolve, reject) => {
      this.db.collection('users').doc(this.userId).update(user).then(() => {
        resolve(1)
      }).catch((err) => {
        resolve(err);
      });
    });

    return promise;
  }
}
