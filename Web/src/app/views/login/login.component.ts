import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UserModel } from 'src/app/shared/models/user.model';
import { AuthApiService } from 'src/app/shared/services/auth-api.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {
  public userGroup!: FormGroup;
  public users: UserModel[] | undefined;

  constructor(
    private _fb: FormBuilder,
    private readonly _authApiService: AuthApiService,
    private readonly _userService: UserService
  ) {}

  ngOnInit(): void {
    this.userGroup = this._fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  async createUser() {
    const { username, password } = this.userGroup?.value;

    this._authApiService.login(username, password)
      .subscribe(({ token }) => {
        localStorage.setItem('@Users.brazuca::token', JSON.stringify(token));
      });

    this.userGroup?.reset();
  }

  async getUsers() {
    this.users = await this._userService.getUsers();
  }
}
