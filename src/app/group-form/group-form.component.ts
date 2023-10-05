import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { GroupService } from '../group.service';
import { GroupDataService } from '../group-data.service';

@Component({
  selector: 'app-group-form',
  templateUrl: './group-form.component.html',
  styleUrls: ['./group-form.component.css']
})
export class GroupFormComponent implements OnInit {
  groupForm!: FormGroup;
  isFormVisible: boolean = false;

  @Output() groupSubmitted = new EventEmitter<any>();
  @Output() formClosed = new EventEmitter<void>();

  @Input() selectedGroup: any;
  @Input() group: any;
  groupUpdated: any;



  constructor(private groupService: GroupService, private fb: FormBuilder,private groupDataService:GroupDataService) {
    this.initGroupForm();
  }
  ngOnInit(): void {
    this.addMember();
    if (this.selectedGroup) {
      // Patch form values for editing an existing group

      this.groupForm.patchValue({
        id: this.selectedGroup.id,
        group_name: this.selectedGroup.group_name,
        group_admin_name: this.selectedGroup.group_admin_name,
        add_members: this.selectedGroup.members,
      });
    }
  }

  private initGroupForm(): void {
    this.groupForm = this.fb.group({
      id: [null], // Keep it null for new groups, and set it when editing
      group_name: ['', Validators.required],
      group_admin_name: ['', Validators.required],
      add_members: this.fb.array([]),
    });

    if (this.selectedGroup) {
      this.selectedGroup.members.forEach((member: string) => {
        this.addMember(member);
      });
    }
  }

  //DONE DONE
 onSubmit(): void {
    if (this.groupForm.valid) {
      const formData = this.groupForm.value;

      // Create or update the group based on the presence of 'id'
      if (formData.id) {
        // Update an existing group

        this.groupService.updateGroup(formData.id, formData).subscribe((updatedGroup) => {
          this.groupUpdated.emit(updatedGroup)
        });
      }  else {
        // Generate a unique ID for new groups
        formData.id = this.generateUniqueId();

        // Create a new group
        this.groupService.createGroup(formData).subscribe((createdGroup) => {
          this.groupSubmitted.emit(createdGroup);
          console.log(formData)
        });
      }
      // Reset the form to its initial state
      this.initGroupForm();
    }
  }


  private generateUniqueId(): string {
    // Generate a unique ID (you can use a library or implement your own logic)
    // Example: return a timestamp-based ID
    return Date.now().toString();
  }

  addMember(memberName = ''): void {
    const membersArray = this.getAddMembersFormArray();
    membersArray.push(this.fb.control(memberName));
  }

  removeMember(index: number): void {
    const membersArray = this.getAddMembersFormArray();
    membersArray.removeAt(index);
  }

  getAddMembersFormArray(): FormArray {
    return this.groupForm.get('add_members') as FormArray;
  }

  closeForm(event: Event): void {
    event.stopPropagation();
    this.isFormVisible = false;
    this.formClosed.emit();
  }
}
