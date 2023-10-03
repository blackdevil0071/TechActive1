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
    if (this.group) {
      this.groupForm.patchValue({
        group_name: this.group.group_name,
        group_admin_name: this.group.group_admin_name,
        // Add other form fields and patch them as needed
      });
    }
    }


  private initGroupForm(): void {
    this.groupForm = this.fb.group({
      id: [null], // Add an 'id' field
      group_name: ['', Validators.required],
      group_admin_name: ['', Validators.required],
      add_members: this.fb.array([]), // Use a FormArray for members
    });

    if (this.selectedGroup) {
      this.groupForm.patchValue({
        id: this.selectedGroup.id, // Set the 'id' if it's an existing group
        group_name: this.selectedGroup.group_name,
        group_admin_name: this.selectedGroup.group_admin_name,
      });

      // Populate existing members in the FormArray
      this.selectedGroup.members.forEach((member: string | undefined) => {
        this.addMember(member);
      });
    }
  }

  onSubmit(): void {
    if (this.groupForm.valid) {
      const formData = this.groupForm.value;

      if (this.selectedGroup) {
        // Update existing group
        this.selectedGroup.group_name = formData.group_name;
        this.selectedGroup.group_admin_name = formData.group_admin_name;

        // Update members
        this.selectedGroup.members = formData.add_members;

        this.groupService
          .updateGroup(this.selectedGroup.id, this.selectedGroup)
          .subscribe((updatedGroup) => {
            this.groupSubmitted.emit(updatedGroup);
            this.groupDataService.setGroupData(updatedGroup);
            this.groupService.updateGroup(this.group.id,this.group).subscribe((updatedGroup)=>{
              this.groupUpdated.emit(updatedGroup)            })
          });
      } else {
        // Create a new group
        const newGroup = {
          id: null, // The 'id' will be assigned by the backend
          group_name: formData.group_name,
          group_admin_name: formData.group_admin_name,
          members: formData.add_members,
        };

        this.groupService.createGroup(newGroup).subscribe((createdGroup) => {
          this.groupSubmitted.emit(createdGroup);
        });
      }

      // Reset the form
      this.groupForm.reset();
    }
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
