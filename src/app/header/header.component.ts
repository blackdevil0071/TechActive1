import { Component, OnInit } from '@angular/core';
import { GroupDataService } from '../group-data.service'; // Import the service
import { GroupService } from '../group.service'; // Import the GroupService for fetching data

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  // Static user information
  userInfo = { name: 'Yourname', email: 'YourEmail' };

  // Initialize counts with default values
  totalGroupsCreated = 0;
  totalGroupsUpdated = 0;

  constructor(
    private groupDataService: GroupDataService,
    private groupService: GroupService
  ) {}

  ngOnInit(): void {
    // Subscribe to changes in group data
    this.groupDataService.groupData$.subscribe((groups) => {
      // Update counts based on the updated group data
      this.totalGroupsCreated = groups.length;

      // Implement logic to count updated groups if needed
    });

    // Fetch initial group data when the component initializes
    this.groupService.getAllGroups().subscribe((groups) => {
      // Update the group data in the service, which will trigger the above subscription
      this.groupDataService.updateGroupData(groups);
    });

    {
      this.groupDataService.groupData$.subscribe((groups)=>{
        this.totalGroupsUpdated = groups.length
      })
    }
  }
}
