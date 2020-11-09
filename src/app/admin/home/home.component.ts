import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';

import { AuthService } from '../../auth/auth.service';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-admin-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  isLoading = true;
  isEditMode = false;
  selectedUser: any;
  staticData: any;
  private _authStatusSub$: Subscription;
  private _isUserAuthenticated = false;
  private _currentUserId: string;
  private _allUsers: any;

  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private _authService: AuthService,
    private _adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.isEditMode = false;

    this._authStatusSub$ = this._authService
      .getAuthStatusListener()
      .subscribe((response) => {
        this._isUserAuthenticated = response.authData.isUserAuthenticated;
        this._currentUserId = response.authData.userId;
      });

    this._getAllUsers();

    this._adminService.getStaticData().subscribe(
      (response) => {
        this.staticData = response;
      },
      (error) => {
        console.log(error);
        this.isLoading = false;
      }
    );

    this.isLoading = false;
  }

  ngOnDestroy(): void {
    this._authStatusSub$.unsubscribe();
  }

  isUserAuthenticated(): boolean {
    return this._isUserAuthenticated;
  }

  getCurrentUserId(): string {
    return this._currentUserId;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  currentRow(row: any): void {
    this.selectedUser = row;
    this.isEditMode = true;
  }

  isEditCompleted($event) {
    this.isEditMode = !$event;
  }

  async refreshUserData($event) {
    // console.log($event);
    this._allUsers = this._allUsers.map((user) => {
      if (user._id === $event.userId) {
        return {
          ...user,
          email: $event.email,
          isAdmin: $event.isAdmin,
          roles: $event.roles,
          name: $event.name,
        };
      } else {
        return user;
      }
    });

    await this._setDataSource();
  }

  showLoading($event) {
    this.isLoading = $event;
  }

  private _getAllUsers(): void {
    this._adminService.getAllUsers().subscribe(
      async (response) => {
        // console.log('_getAllUsers', response);
        this._allUsers = response.allUsers;
        await this._setDataSource();
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        console.log(error);
      }
    );
  }

  private async _setDataSource() {
    this.dataSource = await new MatTableDataSource(this._allUsers);
    this.dataSource.paginator = await this.paginator;
    this.dataSource.sort = await this.sort;
  }
}
