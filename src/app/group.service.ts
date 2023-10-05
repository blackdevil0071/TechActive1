import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private apiBaseUrl = 'http://localhost:3000'; // Replace with your API base URL


  private totalGroupsCountSubject = new BehaviorSubject<number>(0);
  totalGroupsCount$: Observable<number> = this.totalGroupsCountSubject.asObservable();

  constructor(private http: HttpClient) {}

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  // Fetch all groups
  getAllGroups(): Observable<any[]> {
    const url = `${this.apiBaseUrl}/posts`;
    return this.http.get<any[]>(url, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Create a new group
  createGroup(groupData: any): Observable<any> {
    const url = `${this.apiBaseUrl}/posts`;
    return this.http.post<any>(url, groupData, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Update an existing group by ID
  updateGroup(groupId: string, groupData: any): Observable<any> {
    const url = `${this.apiBaseUrl}/posts/1696429520507`;
    // Perform the PUT request
    return this.http.put<any>(url, groupData, this.httpOptions).pipe(
      catchError((error) => {
        // Log the error for debugging
        console.error('Error updating group:', error);

        return throwError('Error updating group: ' + error.message); // Return a custom error message
      })
    );
  }
  // Delete a group by ID
  deleteGroup(groupId: string): Observable<void> {
    const url = `${this.apiBaseUrl}/posts/${groupId}`;
    return this.http.delete<void>(url, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Handle API errors
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('API Error:', error);
    return throwError('Something went wrong; please try again later.');
  }

  updateTotalGroupsCount(count: number): void {
    this.totalGroupsCountSubject.next(count);
  }
}
