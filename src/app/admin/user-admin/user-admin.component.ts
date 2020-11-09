import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

import { AuthService } from '../../auth/auth.service';
import { AdminService } from '../admin.service';
import { SnackbarService } from '../../utils/snackbar.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-admin.component.html',
  styleUrls: ['./user-admin.component.css'],
})
export class UserAdminComponent implements OnInit, OnDestroy {
  isLoading = true;
  selectIndex = 0;
  availableRoles: any;
  selectedRoles: any = [];

  private _authStatusSub$: Subscription;
  private _isUserAuthenticated = false;
  private _isUserAdmin = false;
  private _currentUserId: string;

  @Input() selectedUser: any;
  @Input() staticData: any;
  @Output() editCompleted = new EventEmitter<boolean>();
  @Output() showLoading = new EventEmitter<boolean>();
  @Output() refreshUser = new EventEmitter<any>();

  basicFormGroup = new FormGroup({});

  constructor(
    private _authService: AuthService,
    private _snackbarService: SnackbarService,
    private _adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.showLoading.emit(true);

    if (this.selectedUser?.roles?.length > 0) {
      this.selectedRoles = this.staticData.allUserRoles.filter((role) =>
        this.selectedUser.roles.includes(role._id)
      );

      this.availableRoles = this.staticData.allUserRoles.filter(
        (role) => !this.selectedUser.roles.includes(role._id)
      );
    } else {
      this.availableRoles = [...this.staticData.allUserRoles];
    }

    this._authStatusSub$ = this._authService
      .getAuthStatusListener()
      .subscribe((response) => {
        this._isUserAuthenticated = response.authData.isUserAuthenticated;
        this._isUserAdmin = response.authData.isAdmin;
        this._currentUserId = response.authData.userId;
      });

    if (this.selectedUser) {
      this.basicFormGroup = new FormGroup({
        username: new FormControl(
          this.selectedUser?.username,
          Validators.required
        ),
        name: new FormControl(this.selectedUser?.name, Validators.required),
        email: new FormControl(this.selectedUser?.email, {
          validators: [Validators.required, Validators.email],
        }),
        isAdmin: new FormControl(
          this.selectedUser?.isAdmin,
          Validators.required
        ),
      });

      this.basicFormGroup.controls.username.disable();
    }

    this.isLoading = false;
    this.showLoading.emit(false);
  }

  ngOnDestroy(): void {
    this.editCompleted.emit(true);
    this._authStatusSub$.unsubscribe();
  }

  onEditComplete(): void {
    this._updateUserData();
  }

  isUserAuthenticated(): boolean {
    return this._isUserAuthenticated;
  }

  onUpdateUserAvatar() {
    this._snackbarService.showError(`Update Avatar feature not available yet!`);
  }

  onChangePassword() {
    this._snackbarService.showError(
      `Update Password feature not available yet!`
    );
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  private async _updateUserData() {
    if (!this.basicFormGroup.valid) return;

    this.isLoading = true;
    this.showLoading.emit(true);

    const userData = {
      userId: this.selectedUser._id,
      name: this.basicFormGroup.value.name,
      email: this.basicFormGroup.value.email,
      isAdmin: this.basicFormGroup.value.isAdmin,
      roles: this.selectedRoles.map((role) => {
        return role._id;
      }),
    };

    this._adminService.updateUserData(userData).subscribe(
      async (response) => {
        this._snackbarService.showSuccess(`User updated successfully!`);
        await this.refreshUser.emit(userData);
        this._clearEvents();
      },
      (error) => {
        console.log(error);
        this._clearEvents();
      }
    );
  }

  private _clearEvents() {
    this.isLoading = false;
    this.showLoading.emit(false);
    this.editCompleted.emit(true);
  }
}
