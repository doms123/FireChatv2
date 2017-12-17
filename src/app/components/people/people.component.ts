import { Component, OnInit } from '@angular/core';
import { AddFriendComponent } from '../add-friend/add-friend.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent implements OnInit {

  constructor(
    public dialog: MatDialog, 
    public snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
  }

  addFriend() {
    const dialogRef = this.dialog.open(AddFriendComponent, {
      width: '300px',
      data: {name: 'Dominick Sanchez'}
    });

    dialogRef.afterClosed().subscribe(result => {
      
    });
  }
}
