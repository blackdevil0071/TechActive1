import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GroupService } from '../group.service';

@Component({
  selector: 'app-group-edit',
  templateUrl: './group-edit.component.html',
  styleUrls: ['./group-edit.component.css'],
})
export class GroupEditComponent implements OnChanges {
  @Input() selectedGroup: any;
  @Output() groupUpdated = new EventEmitter<any>();
  editForm: FormGroup;

  constructor(private fb: FormBuilder, private groupService: GroupService) {
    this.editForm = this.fb.group({
      id: [''],
      group_name: ['', Validators.required],
      group_admin_name: ['', Validators.required],
      add_members: this.fb.array([]),
      // Add other fields as needed
    });
  }

  ngOnChanges() {
    // Update the form when the selectedGroup input changes
    if (this.selectedGroup) {
      this.editForm.patchValue(this.selectedGroup);
    }
  }

  onSubmit() {
    console.log("Form Submitted")
    if (this.editForm.valid) {
      const updatedGroup = this.editForm.value;
      this.groupService.updateGroup(updatedGroup.id, updatedGroup).subscribe(
        (result) => {
          this.groupUpdated.emit(updatedGroup);
          console.log(result);
        },
        (error) => {
          console.error('Error updating group:', error);
        }
      );
    }
  }
}
