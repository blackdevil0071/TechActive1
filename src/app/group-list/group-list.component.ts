import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { GroupService } from '../group.service';
import { Router } from '@angular/router';
import { GroupDataService } from '../group-data.service';
import { GroupFormComponent } from '../group-form/group-form.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.css'],
})
export class GroupListComponent implements OnInit, OnChanges {
  @Input() newGroup: any;
  groups: any[] = [];
  selectedGroup: any | null = null;
  expandedRow: number | null = null;
  isFormVisible: boolean = false;
  totalGroups: number = 0;
  searchQuery: string = '';
  originalGroups: any[] = [];


  constructor(private dialog:MatDialog,private groupService: GroupService,private router:Router,private groupDataService:GroupDataService) {}

  ngOnInit(): void {
    this.groupDataService.getGroupData().subscribe((data) => {
      if (data) {
        this.groups = data;
        this.originalGroups = [...this.groups];
      } else {
        this.fetchGroups();
      }
    });

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['newGroup'] && changes['newGroup'].currentValue) {
      // If a new group is received via @Input, add it to the groups array
      this.groups.push(changes['newGroup'].currentValue);
    }
  }

  @Output() groupSelected = new EventEmitter<any>();

  showGroupDetails(group: any, index: number): void {
    this.expandedRow = index;
    this.groupSelected.emit(group);
  }
fetchGroups(): void {
  console.log('Fetching groups...');
  this.groupService.getAllGroups().subscribe(
    (data) => {
      console.log('Received data:', data);
      // Update the groups array
      this.groups = data;


      this.totalGroups = this.groups.length;

    },
    (error) => {
      console.error('Error fetching groups:', error);
    }
  );
}

searchGroups(): void {
  if (!this.searchQuery) {
    // If the search query is empty, show all groups
    // You can reset the groups array to its original state
    // or fetch all groups from your data source again.
    this.fetchGroups()
    this.groups = [...this.originalGroups];

  } else {
    // If there is a search query, filter the groups based on the query
    this.groups = this.originalGroups.filter((group) =>
      group.group_name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}

deleteGroup(group: any): void {
  const groupId = group?.id;


  if (groupId) {
    // Call the backend API to delete the group by its id
    this.groupService.deleteGroup(groupId).subscribe(
      () => {
        // Deletion was successful
        console.log('Deleted successfully');

        // You can add any additional logic here after successful deletion
        // For example, you can update your local data or perform any other necessary actions.
        // Optionally, you can also fetch the updated list of groups from the API.
        this.fetchGroups();
      },
      (error) => {
        // Handle error
        console.error('Error deleting group:', error);

        // If there's an error, you can handle it as needed.
        // For example, you can show an error message to the user or perform any other error handling steps.
      }
    );
  } else {
    console.error('Invalid group id:', group);

    // If the group id is invalid or missing, you can handle it here.
    // For example, you can log an error message or display a user-friendly message to the user.
  }
}



  copyGroup(group: any): void {
    const copiedGroup = { ...group };
    copiedGroup.id = this.generateUniqueId();
    this.groups.push(copiedGroup);

    // Increment the totalGroups count
    this.totalGroups++;

    console.log('Copied successfully');
  }

  private generateUniqueId(): number {
    return Math.floor(Math.random() * 1000);
  }
  editGroup(group: any): void {
    // You can open the edit form dialog here and pass the selected group to it.
    // This example assumes you have an EditGroupComponent for editing.
    // You need to create the EditGroupComponent for editing and open it as a dialog.
    const dialogRef = this.dialog.open(GroupFormComponent, {
      width: '400px', // Set the width of the dialog as needed
      data: { group }, // Pass the group data to the dialog
    });


    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // The dialog returned a result (edited group), you can handle it here.
        // For example, you can update the group in your groups array.
        const editedGroup = result as any; // Cast the result to the group type
        // Find the index of the edited group in the groups array and update it
        const index = this.groups.findIndex((g) => g.id === editedGroup.id);
        if (index !== -1) {
          this.groups[index] = editedGroup;
        }
      }
    });
  }
  showForm(): void {
    this.isFormVisible = true;
  }

  closeForm(): void {
    this.isFormVisible = false;
  }
  deleteMember(group: any, member: string): void {
    const index = group.members.indexOf(member);
    if (index !== -1) {
      group.members.splice(index, 1);
      this.groupService.updateGroup(group.id, group).subscribe((updatedGroup) => {
        console.log('Member deleted:', updatedGroup);
        // Optionally, you can fetch the updated groups after deletion if needed.
        this.fetchGroups();
      });
    }
  }

}
//DONE DONE DONE
