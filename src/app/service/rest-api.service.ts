import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { Register } from '../shared/register';

@Injectable({
  providedIn: 'root',
})
export class RestApiService {
  indexArray!: Register[];
  index!: Register;
  constructor(private http: HttpClient) {}
  private apiUrl = 'http://localhost:3000';

  GetAllProfile() {
    return this.http.get<Register[]>('http://localhost:3000/profiles');
  }
  
  getProfile() {
    return this.http.get<Register[]>('http://localhost:3000/profiles').pipe(
      map((profiles: string | any[]) => {
        const lastProfile = profiles[profiles.length - 1];
        // const Img:string = lastProfile.profileImg;
        return {  lastProfile }
        
        // return { Img };
      })
    );
  }


  // getProfileImg(): Observable<any> {
  //   return this.http.get<any>(`${this.apiUrl}/profiles`).pipe(
  //     map((profiles: string | any[]) => {
  //       const lastProfile = profiles[profiles.length - 1];
  //       if (lastProfile && lastProfile.profileImage) {
  //         lastProfile.profileImage = `${this.apiUrl}/profiles/${lastProfile.profileImage}`;
  //       }
  //       return { lastProfile };
  //     })
  //   );
  // }
  

  private handleError(err: any) {
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occured ${err.error.message}`;
    } else {
      errorMessage = `Backend returned with code ${err.status} : ${err.body.error}`;
    }
    console.log(err);
    return throwError(errorMessage);
  }

  CreateProfile(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Register[]>(`${this.apiUrl}/profiles`, data, { headers });
  }

  createProfile(Createprofiles: Register) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.index = this.indexArray.pop() || this.initializeProduct();
    Createprofiles.firstname = this.index.firstname + 1;
    return this.http
      .post<Register[]>(this.apiUrl, Createprofiles, { headers })
      .pipe(
        tap((data) => console.log('Created Product: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  updateProfile(product: Register) {
    const url = `${this.apiUrl}/${product.firstname}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.patch<Register[]>(url, product, { headers }).pipe(
      tap(() => console.log(' Updated Product: ' + product.firstname)),
      map(() => product),
      catchError(this.handleError)
    );
  }
  getProfilePic() {
    return this.http.get<Register[]>('http://localhost:3000/profiles').pipe(
      map((profiles: Register[]) => {
        const profileFieldOnly = profiles.map((profile) => profile.profileImg);
        return { profileFieldOnly };
      })
    );
  }
  private initializeProduct(): Register {
    return {
      profileImg: '',
      firstname: '',
      lastname: '',
      email: '',
      contact: 0,
      age: 0,
      state: '',
      country: '',
      address: '',
      tag: '',
      subscribe: false,
    };
  }
}
