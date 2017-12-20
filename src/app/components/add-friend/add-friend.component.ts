import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import * as firebase from 'firebase';
import 'firebase/firestore';

@Component({
  selector: 'app-add-friend',
  templateUrl: './add-friend.component.html',
  styleUrls: ['./add-friend.component.css']
})
export class AddFriendComponent implements OnInit {
  db:any = firebase.firestore();
  user_id:string;
  email:string;

  constructor(public dialogRef: MatDialogRef<AddFriendComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public snackBar: MatSnackBar,) { }

  ngOnInit() {
    this.user_id = localStorage.getItem('user_id');
    this.email = localStorage.getItem('email');
  }

  onNoClick(): void { 
    this.dialogRef.close(0);
  }

  sendFriendRequest() {
    let friendEmail = this.data['email'];
    let friendName = friendEmail.split('@')[0];
    let userName = this.email.split('@')[0];
    let docName = (friendName > userName) ? userName + '_' + friendName : friendName + '_' + userName;

    // validate if already added on friends
    this.db.collection('friends').doc(docName).get().then(user => {
      if (user.exists) {
        this.snackBar.open("Error! duplicate friend request.", 'closed', { duration: 4000 });
      }else {
        this.db.collection('friends').doc(docName).set({
          is_friend: false,
          sender: userName
        });
        this.snackBar.open('Friend request was sent', 'closed', { duration: 4000 });
      }
    });
  
    this.dialogRef.close(1);
  }
}
