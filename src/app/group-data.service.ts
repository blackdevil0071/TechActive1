import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GroupDataService {
  private groupDataSubject = new BehaviorSubject<any[]>([]);
  groupData$: Observable<any[]> = this.groupDataSubject.asObservable();

  constructor() {}

  setGroupData(data: any) {
    this.groupDataSubject.next(data);
  }

  getGroupData() {
    return this.groupDataSubject.asObservable();
  }

  // Method to add a new group to the local data
  addGroup(group: any): void {
    const currentData = this.groupDataSubject.value;
    currentData.push(group);
    this.groupDataSubject.next(currentData);
  }

  // Method to remove a group from the local data by ID
  removeGroupById(groupId: number): void {
    const currentData = this.groupDataSubject.value;
    const updatedData = currentData.filter((group) => group.id !== groupId);
    this.groupDataSubject.next(updatedData);
  }

  updateGroupData(groups: any[]): void {
    this.groupDataSubject.next(groups);
  }
}
