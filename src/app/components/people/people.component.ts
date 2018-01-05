import { Component, OnInit, ViewChild, Output, ElementRef, EventEmitter, Renderer2 } from '@angular/core';
import { AddFriendComponent } from '../add-friend/add-friend.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import { PeopleService } from '../../services/people.service';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as JROLL from 'jroll';
import 'jroll-pulldown';

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
  @ViewChild('pulldown') pulldown: ElementRef;

  constructor(
    public dialog: MatDialog, 
    public snackBar: MatSnackBar,
    private peopleService: PeopleService,
    private elementRef: ElementRef,
    private renderer: Renderer2,
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

  ngAfterViewInit() {
    setTimeout(() => {
      console.log(this.pulldown);
      let jroll = new JROLL(this.pulldown.nativeElement);
      jroll.pulldown({
        refresh: (complete) => {
          this.loadPeoples();
          complete();
        },
        spinning: false,
        textPull: '',
        textRelease: '',
        textLoading: '',
        textFinish: '',
        iconArrow: '<img width="50px" height="50px" src="http://thinkfuture.com/wp-content/uploads/2013/10/loading_spinner.gif">',
        iconLoading: '<img width="50px" height="50px" src="http://thinkfuture.com/wp-content/uploads/2013/10/loading_spinner.gif">',
        iconFinish: '<img width="50px" height="50px" src="http://thinkfuture.com/wp-content/uploads/2013/10/loading_spinner.gif">'
      });
    }, 3000);
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

  capitalize(str) {
    var wordCount = str.split(' ');
    var upperStr = '';
    for (let x = 0; x <= wordCount.length - 1; x++) {
      if(x > 0) {
        upperStr += ' ';
      }
      
      upperStr += wordCount[x].charAt(0).toUpperCase() + wordCount[x].slice(1).toLowerCase();
    }

    return upperStr;
  }

  search() {
    if(this.searchTxt != '' && this.searchTxt !== undefined) {
      this.fetching = true;
      this.db.collection('users').where('name', '==', this.capitalize(this.searchTxt)).get().then(res => {
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
