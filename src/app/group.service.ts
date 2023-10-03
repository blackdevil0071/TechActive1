import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private apiBaseUrl = 'https://crudcrud.com/api/f05d3e39208c4e8bb8333442aaa86557'; // Replace 'your-api-key' with your actual API key

  constructor(private http: HttpClient) {}

  // Define HTTP headers if needed
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  // Fetch all groups
  getAllGroups(): Observable<any[]> {
    const url = `${this.apiBaseUrl}/groups`;
    return this.http.get<any[]>(url, this.httpOptions);
  }

  // Create a new group
  createGroup(groupData: any): Observable<any> {
    const url = `${this.apiBaseUrl}/groups`;
    return this.http.post<any>(url, groupData, this.httpOptions);
  }


  updateGroup(groupId: string, groupData: any): Observable<any> {
    const url = `${this.apiBaseUrl}/groups/${groupId}`;
    return this.http.put<any>(url, groupData, this.httpOptions);
  }

  deleteGroup(groupId: string): Observable<any> {
    const url = `${this.apiBaseUrl}/groups/${groupId}`;
    return this.http.delete<any>(url, this.httpOptions);
  }


}
