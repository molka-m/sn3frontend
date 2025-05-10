import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Application} from "../../models/application";
import {UserApplicationAssignmentRequest} from "../../models/userApplicationAssignment";

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {

  private backendUrl = 'http://localhost:8081/api/v1/app';


  constructor(private http: HttpClient) {
  }


  findAllApp(): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.backendUrl}/all`);
  }


  addApplication(newApp: Application): Observable<Application> {
    return this.http.post<Application>(`${this.backendUrl}/add`, newApp);
  }

  deleteApplication(applicationName: string): Observable<any> {
    console.log("delete method")
    return this.http.delete<any>(`${this.backendUrl}/delete/` + applicationName);
  }

  affectGroupToApplication(applicationName: string, uuidGroup: String,userApplicationAssignment : UserApplicationAssignmentRequest): Observable<any> {
    return this.http.post<any>(`${this.backendUrl}/addGroup/` + applicationName + "/" + uuidGroup, userApplicationAssignment);
  }

  removeUsersFromApplication(applicationUUID: string | undefined, uuids : string[]): Observable<any> {
    return this.http.post<any>(`${this.backendUrl}/remove-users/` + applicationUUID, uuids);

  }

  getApplicationDetails(uuidApplication: string | undefined): Observable<any> {
    return this.http.get<any>(`${this.backendUrl}/application-Details/${uuidApplication}`);
  }

/*  affectUsersToApplication(uuidApplication:string,userApplicationAssignment : UserApplicationAssignmentRequest){
    return this.http.post<any>(`${this.backendUrl}/assingUsers/` + uuidApplication , userApplicationAssignment);
  }*/
}
