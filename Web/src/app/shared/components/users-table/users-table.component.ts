import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.sass']
})
export class UsersTableComponent implements AfterViewInit {
  public loading: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public resultsLength = 0;
  public displayedColumns: string[] = ['name', 'username', 'role', 'action'];
  public dataSource: MatTableDataSource<any>;

  constructor(
    private readonly _userService: UserService,
    private _snackBar: MatSnackBar
  ) {
    const none = [{ name: 'none', username: 'none', role: 'none', action: '' }];
    this.getUsers().then();

    this.dataSource = new MatTableDataSource(none);
  }

  public ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public async getUsers() {
    setInterval(() => {
      this.loading = true;
    }, 3000);

    const users = await this._userService.getUsers().then(
      result => this.dataSource = new MatTableDataSource(result)
    ).catch((error: any) => {
      this.openSnackBar(error.error.message, 'error');
    });

    return users;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(!message ? "Occured and error" : message, action);
  }
}
