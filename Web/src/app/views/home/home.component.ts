import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/shared/services/user.service';

export interface Role {
  value: string;
  label: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {
  public userGroup!: FormGroup;

  public readonly roles: Role[] = [
    { value: 'ReadWrite', label: 'Root' },
    { value: 'Read', label: 'Normal Access' }
  ];

  constructor(
    private _fb: FormBuilder,
    private readonly _userService: UserService
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

  public ngOnInit(): void {
    this.userGroup = this._fb.group({
      name: new FormControl(
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50)
        ]
      ),
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
      role: new FormControl('', [Validators.required])
    });
  }

  public async createUser(): Promise<void> {
    const { name, username, password, role } = this.userGroup?.value;

    await this._userService
      .create(name, username, password, role)
      .then(_ => window.location.reload());
  }
}
