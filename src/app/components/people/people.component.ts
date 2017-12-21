import { Component, OnInit, ViewChild, Output, ElementRef, EventEmitter } from '@angular/core';
import { AddFriendComponent } from '../add-friend/add-friend.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import { PeopleService } from '../../services/people.service';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import JRoll from 'jroll';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent implements OnInit {
  peoples:any = [];
  db:any = firebase.firestore();
  fetching:boolean = false;
  searchTxt: string;
  userId: string;
  userEmail: string;
  searchForm: FormGroup;
  searchTxtCtrl: FormControl;
  searchResultCount: number;
  isSearching:boolean = false;
  hasLoadingSpinner:boolean = true;
  noSearchMsg:boolean = false;

  constructor(
    public dialog: MatDialog, 
    public snackBar: MatSnackBar,
    private peopleService: PeopleService,
    private elementRef: ElementRef
    
  ) {
    this.userId = localStorage.getItem('user_id');
    this.userEmail = localStorage.getItem('email');
    this.loadPeoples();
  }

  ngOnInit() {
    this.searchTxtCtrl = new FormControl('');

    this.searchForm = new FormGroup({
      searchTxt: this.searchTxtCtrl
    });
  }

  loadPeoples() {
    if (this.hasLoadingSpinner) {
      this.fetching = true;
      this.db.collection('users').get().then(users => {
        let peopleObj = users.docs.filter(doc => doc.id != this.userId);
        let peoples = users.docs.filter(doc => doc.id != this.userId).map(user => user.data());
        let userEmailArr = this.userEmail.split('@');
        let userEmail = userEmailArr[0];
        this.peoples = [];
        for (let people of peoples) {
          let peopleEmailArr = people.email.split('@');
          let peopleEmail = peopleEmailArr[0];
          let friendName = (userEmail > peopleEmail) ? peopleEmail + '_' + userEmail : userEmail + '_' + peopleEmail;

          this.db.collection('friends').doc(friendName).get().then(data => {
            if (data.exists) {
              console.log('friend request was sent');
            } else {
              this.peoples.push(people);
              this.fetching = false;
              this.isSearching = false;
            }
          }).then(() => {
            if (this.peoples.length == 0) {
              this.fetching = false;
              this.isSearching = false;
            }
          });
        }
      });
    }
  }

  addFriend(friend:object, index) {
    const dialogRef = this.dialog.open(AddFriendComponent, {
      width: '300px',
      data: {
        // index: 
        user_id: friend['user_id'],
        email: friend['email'],

      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.peoples.splice(index, 1);
      }
    });
  }

  search() {
    if(this.searchTxt != '' && this.searchTxt !== undefined) {
      this.fetching = true;
      this.db.collection('users').where('name', '==', this.searchTxt).get().then(res => {
        let peoples = [];
        let filteredPeople = [];
        if(res.docs.length) { // Has a search result
          res.forEach((doc) => {
            peoples.push(doc.data());
          });

          let userEmailArr = this.userEmail.split('@');
          let userEmail = userEmailArr[0];
          for (let people of peoples) {
            let peopleEmailArr = people.email.split('@');
            let peopleEmail = peopleEmailArr[0];
            let friendName = (userEmail > peopleEmail) ? peopleEmail + '_' + userEmail : userEmail + '_' + peopleEmail;
            this.db.collection('friends').doc(friendName).get().then(data => {
              if (data.exists) {
                console.log('friend request was sent');
              } else {
                if (userEmail != peopleEmail) {
                  filteredPeople.push(people);
                }
                
                this.fetching = false;
                this.isSearching = true;
              }
            }).then(() => {
              this.fetching = false;
              this.noSearchMsg = true;
            });
          }
          this.peoples = filteredPeople;
        }else {
          this.peoples = [];
          this.searchResultCount = 0;
          this.fetching = false;
          this.noSearchMsg = true;
        }
      });
    }
  }

  searching() {
    if (this.searchTxt != '' && this.searchTxt !== undefined) {
      if(this.searchTxt.length) {
        this.isSearching = true;
      }
    }
  }

  clearSearch() {
    this.searchTxt = '';
    this.loadPeoples();
  }
}
