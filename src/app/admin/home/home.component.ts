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

  async isEditCompleted($event) {
    this.isEditMode = !$event;
    // Refresh user list
    await this._getAllUsers();
  }

  showLoading($event) {
    this.isLoading = $event;
  }

  private _getAllUsers(): void {
    this._adminService.getAllUsers().subscribe(
      async (response) => {
        // console.log(response);
        this.dataSource = await new MatTableDataSource(response.allUsers);

        this.dataSource.paginator = await this.paginator;
        this.dataSource.sort = await this.sort;

        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        console.log(error);
      }
    );
  }
}
