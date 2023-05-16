import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { UserService } from '../../services/user.service';
import { Role } from 'src/app/views/home/home.component';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.sass']
})
export class UpdateComponent implements OnInit {
  public userGroup!: FormGroup;
  private _id!: number;
  public loading = true;

  public readonly roles: Role[] = [
    { value: 'ReadWrite', label: 'Root' },
    { value: 'Read', label: 'Normal Access' }
  ];

  constructor(
    private _fb: FormBuilder,
    private readonly _userService: UserService,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _router: Router,
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

  async ngOnInit(): Promise<void> {
    const id = this._activatedRoute.snapshot.paramMap.get('id')?.toString();
    this._id = parseInt(id ? id : "", 10);

    const user = await this._userService.getById(this._id);

    if (user) {
      this.userGroup = this._fb.group({
        name: new FormControl(
          user.name,
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(50)
          ]
        ),
        username: new FormControl(
          user.username,
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
        role: new FormControl(user.role, [Validators.required])
      });
    }

    this.loading = false;
  }

  public updateUser() {
    const { name, username, password, role } = this.userGroup?.value;

    const id = this._activatedRoute.snapshot.paramMap.get('id')?.toString();
    this._id = parseInt(id ? id : "", 10);

    this._userService
      .update(this._id, name, username, password, role)
      .then(_ => this._router.navigate(['/home']))
      .catch((error: any) => {
        this.openSnackBar(error.error.message, 'error');
      });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(!message ? "Occured and error" : message, action);
  }
}
