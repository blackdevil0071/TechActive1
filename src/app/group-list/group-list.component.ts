import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { GroupService } from '../group.service';
import { Router } from '@angular/router';
import { GroupDataService } from '../group-data.service';
import { GroupFormComponent } from '../group-form/group-form.component';
import { MatDialog } from '@angular/material/dialog';
import { GroupEditComponent } from '../group-edit/group-edit.component';

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
  @Output() groupCopied = new EventEmitter<any>();
  @Output() groupEditRequested = new EventEmitter<any>();
  @Output() groupSelected = new EventEmitter<any>();
  @Output() groupSubmitted = new EventEmitter<any>();
  @Output() groupUpdated = new EventEmitter<any>();
  isDeleting: boolean = false;

  constructor(
    private dialog: MatDialog,
    private groupService: GroupService,
    private router: Router,
    private groupDataService: GroupDataService
  ) {}

  ngOnInit(): void {
    // Subscribe to events
    this.groupSubmitted.subscribe((newGroup) => {
      this.groups.push(newGroup);
    });

    this.groupUpdated.subscribe((updatedGroup) => {
      const index = this.groups.findIndex((group) => group.id === updatedGroup.id);
      if (index !== -1) {
        this.groups[index] = updatedGroup;
      }
    });

    // Fetch initial data
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
      this.groups.push(changes['newGroup'].currentValue);
    }
  }

  // Fetch groups from the server
  fetchGroups(): void {
    this.groupService.getAllGroups().subscribe(
      (data) => {
        console.log('Received data:', data);
        this.groups = data;
        this.totalGroups = this.groups.length;
      },
      (error) => {
        console.error('Error fetching groups:', error);
      }
    );
  }

  // Inside GroupListComponent
// ...

// Sort groups in ascending order by a specific property
sortGroupsAscending(property: string): void {
  this.groups.sort((a, b) => (a[property] > b[property] ? 1 : -1));
}

// Sort groups in descending order by a specific property
sortGroupsDescending(property: string): void {
  this.groups.sort((a, b) => (a[property] < b[property] ? 1 : -1));
}

// ...

  openEditForm(group: any): void {
    const dialogRef = this.dialog.open(GroupEditComponent, {
      width: '400px',
      data: group, // Pass the selected group data to the edit form
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Dialog result:', result);
    });
  }


  // Search for groups
  searchGroups(): void {
    if (!this.searchQuery) {
      this.fetchGroups();
      this.groups = [...this.originalGroups];
    } else {
      this.groups = this.originalGroups.filter((group) =>
        group.group_name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }

  // Toggle expansion of a row
  toggleExpansion(index: number): void {
    if (this.expandedRow === index) {
      this.expandedRow = null;
    } else {
      this.expandedRow = index;
    }
  }

  // Show the group creation form
  showForm(): void {
    this.isFormVisible = true;
  }

  // Close the group creation form
  closeForm(): void {
    this.isFormVisible = false;
  }

  // Copy a group
  copyGroup(group: any): void {
    const copiedGroup = {
      id: this.generateUniqueId(),
      group_name: group.group_name,
      group_admin_name: group.group_admin_name,
      add_members: [...group.add_members],
    };



    this.groupService.createGroup(copiedGroup).subscribe(
      (result) => {
        console.log('Group copied to API:', result);
        this.groups.push(result);
        this.groupCopied.emit(result)
      },
      (error) => {
        console.error('Error copying group to API:', error);
      }
    );
  }

  // Generate a unique ID
  private generateUniqueId(): string {
    return Date.now().toString();
  }


  // Delete a group
  deleteGroup(id: any): void {
    if (this.isDeleting) {
      return;
    }

    this.isDeleting = true;

    const index = this.groups.findIndex((group) => group.id === id);

    if (index !== -1) {
      this.groupService.deleteGroup(id).subscribe(
        () => {
          console.log(`Group with ID ${id} deleted successfully from API.`);
          this.groupDataService.removeGroupById(id);
          this.groups.splice(index, 1);
          this.isDeleting = false;
        },
        (error) => {
          console.error(`Error deleting group with ID ${id} from API:`, error);
          this.isDeleting = false;
        }
      );
    } else {
      console.error(`Group with ID ${id} not found in the local group array.`);
      this.isDeleting = false;
    }
  }

  // Delete a member from a group
  deleteMember(group: any, member: string): void {
    const index = group.add_members.indexOf(member);
    if (index !== -1) {
      group.add_members.splice(index, 1);
      this.groupService.updateGroup(group.id, group).subscribe(
        (updatedGroup) => {
          console.log('Member deleted:', updatedGroup);
        },
        (error) => {
          console.error('Error deleting member from the group:', error);
        }
      );
    }
  }
}
