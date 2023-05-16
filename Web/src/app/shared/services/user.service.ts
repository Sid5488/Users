import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserLoggedModel } from '../models/userLogged.model';
import { AuthApiService } from './auth-api.service';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly _api: string = 'http://localhost:5000/v1/api';
  private _httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this._authApiService.getAuthorizationToken()}`
    })
  };

  constructor(
    private readonly _httpClient: HttpClient,
    private readonly _authApiService: AuthApiService
  ) { }

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

  public async create(
    name: string,
    username: string,
    password: string,
    role: string
  ) {
    const user = { name, username, password, role };

    return await this._httpClient.post<UserModel>(
      `${this._api}/user`,
      user,
      this._httpOptions
    ).toPromise();
  }

  public async getUsers() {
    return await this._httpClient
      .get<UserModel[]>(`${this._api}/user/all`, this._httpOptions)
      .toPromise();
  }

  public async getById(id: number) {
    return await this._httpClient
      .get<UserModel>(`${this._api}/user/${id}`, this._httpOptions)
      .toPromise();
  }

  public async update(
    id: number,
    name: string,
    username: string,
    password: string,
    role: string
  ) {
    const treatedId = JSON.stringify(
      localStorage.getItem('@Users.brazuca::id')
    ).replaceAll('"', '');

    const user = { 
      id: parseInt(treatedId), 
      name, 
      username, 
      password, 
      role 
    };

    return await this._httpClient.put<UserModel>(
      `${this._api}/user/${id}`,
      user,
      this._httpOptions
    ).toPromise();
  }

  public async delete(id: number) {
    const treatedId = JSON.stringify(
      localStorage.getItem('@Users.brazuca::id')
    ).replaceAll('"', '');
    
    return await this._httpClient.delete(
      `${this._api}/user/${id}/${treatedId}`,
      this._httpOptions
    ).toPromise();
  }
}
