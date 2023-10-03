// group-data.service.ts

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
  }//Done
  // Method to update the group data
  updateGroupData(groups: any[]): void {
    this.groupDataSubject.next(groups);
  }
}
