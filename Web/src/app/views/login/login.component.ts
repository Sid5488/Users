import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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
    private readonly _userService: UserService,
    private readonly _router: Router
  ) {}

  get name() {
    return this.userGroup.get('name')!;
  }

  get username() {
    return this.userGroup.get('username')!;
  }

  get password() {
    return this.userGroup.get('password')!;
  }

  get role() {
    return this.userGroup.get('role')!;
  }

  ngOnInit(): void {
    this.userGroup = this._fb.group({
      username: new FormControl(
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50)
        ]
      ),
      password: new FormControl(
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50)
        ]
      ),
    });
  }

  async createUser() {
    const { username, password } = this.userGroup?.value;

    this._authApiService.login(username, password)
      .subscribe(({ token, user }) => {
        const tokenAccess = localStorage.getItem('@Users.brazuca::token');
        
        if (tokenAccess) {
          localStorage.removeItem('@Users.brazuca::token');
          localStorage.removeItem('@Users.brazuca::id');
        }

        localStorage.setItem('@Users.brazuca::token', JSON.stringify(token));
        localStorage.setItem('@Users.brazuca::id', JSON.stringify(user?.id));

        this._router.navigate(['/home']);
      });
  }

  async getUsers() {
    this.users = await this._userService.getUsers();
  }
}
