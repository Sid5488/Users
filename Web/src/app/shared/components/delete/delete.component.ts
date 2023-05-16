import { AfterViewInit, Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.sass']
})
export class DeleteComponent implements AfterViewInit {
  public displayedColumns: string[] = ['name', 'username', 'role', 'action'];
  public dataSource: MatTableDataSource<any>;
  private _id!: number;
  public loading = true;

  constructor(
    private readonly _userService: UserService,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _router: Router,
    private _snackBar: MatSnackBar
  ) {
    const none = [{ name: 'none', username: 'none', role: 'none', action: '' }];
    
    this.getById().then();

    this.dataSource = new MatTableDataSource(none);
  }

  public ngAfterViewInit(): void {}

  public async delete() {
    const id = this._activatedRoute.snapshot.paramMap.get('id')?.toString();
    this._id = parseInt(id ? id : "", 10);

    this._userService
      .delete(this._id)
      .then(_ => this._router.navigate(['/home']))
      .catch(error => this.openSnackBar(error.error.message, 'error'));
  }

  public async getById() {
    const id = this._activatedRoute.snapshot.paramMap.get('id')?.toString();
    this._id = parseInt(id ? id : "", 10);

    const user = await this._userService.getById(this._id);
    this.dataSource = new MatTableDataSource([user]);

    this.loading = false;
    
    return user;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(!message ? "Occured and error" : message, action);
  }
}
