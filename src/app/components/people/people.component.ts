import { Component, OnInit } from '@angular/core';
import { AddFriendComponent } from '../add-friend/add-friend.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import { PeopleService } from '../../services/people.service';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent implements OnInit {
  peoples:any;
  db:any = firebase.firestore();
  fetching:boolean = false;
  searchTxt: string;
  userId: string;
  searchForm: FormGroup;
  searchTxtCtrl: FormControl;
  searchResultCount: number;
  isSearching:boolean = false;

  constructor(
    public dialog: MatDialog, 
    public snackBar: MatSnackBar,
    private peopleService: PeopleService
    
  ) {
    this.userId = localStorage.getItem('user_id');
    this.loadPeoples();
  }

  ngOnInit() {
    this.searchTxtCtrl = new FormControl('');

    this.searchForm = new FormGroup({
      searchTxt: this.searchTxtCtrl
    });
  }

  loadPeoples() {
    this.fetching = true;
    
    this.db.collection('users').onSnapshot(users => {
      const peopleObj = users.docs.filter(doc => doc.id != this.userId);
      this.peoples = users.docs.filter(doc => doc.id != this.userId).map(user => user.data());
      setTimeout(() => {
        this.fetching = false;
        this.isSearching = false;
      }, 400);
    });
  }

  addFriend() {
    const dialogRef = this.dialog.open(AddFriendComponent, {
      width: '300px',
      data: {name: 'Dominick Sanchez'}
    });

    dialogRef.afterClosed().subscribe(result => {
      
    });
  }

  search() {
    if(this.searchTxt != '' && this.searchTxt !== undefined) {
      this.fetching = true;
      this.db.collection('users').where('name', '==', this.searchTxt).get().then(res => {
        this.peoples = [];  
        if(res.docs.length) { // Has a search result
          console.log('resres', res.length);
          res.forEach((doc) => {
          
            console.log(doc.id, " => ", doc.data());
            
            this.peoples.push(doc.data());
          });
        }else {
          this.searchResultCount = 0;
        }
        this.fetching = false;
      });
    }else {
      this.loadPeoples();
    }
  }

  searching() {
    if(this.searchTxt.length) {
      this.isSearching = true;
    }
  }

  clearSearch() {
    this.searchTxt = '';
    this.loadPeoples();
  }
}
