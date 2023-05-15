import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

interface Role {
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

  public users: any = [];

  constructor(
    private _fb: FormBuilder,
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
}
