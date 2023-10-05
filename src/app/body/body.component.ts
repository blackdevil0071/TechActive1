import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GroupFormComponent } from '../group-form/group-form.component';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit {

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  showGroupForm(): void {
    // Open the group form as a dialog
    const dialogRef = this.dialog.open(GroupFormComponent, {
      width: '400px', // Set the width as needed
    });

    // Listen for when the dialog is closed
    dialogRef.afterClosed().subscribe((result) => {
      // Handle any actions after the dialog is closed
      if (result === 'submitted') {
        // The group form was submitted, you can perform any necessary actions here.
      }
    });
  }
}
