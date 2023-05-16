import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Role } from '../home/home.component';
import { UserService } from 'src/app/shared/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-new-account',
  templateUrl: './new-account.component.html',
  styleUrls: ['./new-account.component.sass']
})
export class NewAccountComponent implements OnInit {
  public userGroup!: FormGroup;

  public readonly roles: Role[] = [
    { value: 'ReadWrite', label: 'Root' },
    { value: 'Read', label: 'Normal Access' }
  ];

  constructor(
    private _fb: FormBuilder,
    private readonly _userService: UserService,
    private _snackBar: MatSnackBar
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
      .then(_ => window.location.reload())
      .catch((error: any) => {
        this.openSnackBar(error.error.message, 'error');
      });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(!message ? "Occured and error" : message, action);
  }
}
