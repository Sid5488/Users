import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import jwt_decode from 'jwt-decode';
import { UserLoggedModel } from '../models/userLogged.model';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  private readonly _api = 'http://localhost:5000/v1/api/user';
  private _httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private readonly _httpClient: HttpClient) {}

  public login(username: string, password: string): Observable<UserLoggedModel> {
    const user = { username, password };

    return this._httpClient.post<UserLoggedModel>(
      `${this._api}/login`,
      user,
      this._httpOptions
    );
  }

  public getAuthorizationToken() {
    const token = localStorage.getItem('@Users.brazuca::token');

    return token;
  }

  public getTokenExpirationDate(token: string): Date | null {
    const decoded: any = jwt_decode(token);

    if(decoded.exp === undefined) {
      return null;
    }

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);

    return date;
  }

  public isTokenExpired(token?: string): boolean {
    if(!token)
      return true;

    const date = this.getTokenExpirationDate(token);
    if(date === null)
      return false;

    return !(date.valueOf() > new Date().valueOf());
  }

  public isUserLoggedIn() {
    const token = this.getAuthorizationToken();

    if(!token) return false;
    else if (this.isTokenExpired(token)) return false;

    return true;
  }
}
