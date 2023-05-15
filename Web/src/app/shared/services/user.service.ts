import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserLoggedModel } from '../models/userLogged.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly _api: string = 'https://localhost:5001/v1/api';
  private _httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private readonly _httpClient: HttpClient) { }

  public async login(username: string, password: string): Promise<boolean> {
    const user = { username, password };
    const result = await this._httpClient.post<UserLoggedModel>(
      `${this._api}/user/login`,
      user,
      this._httpOptions
    ).toPromise();

    if(result && result.token) {
      return true;
    }

    return false;
  }

  public async getUsers() {
    return await this._httpClient.get<any>(this._api).toPromise();
  }
}
