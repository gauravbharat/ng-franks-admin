import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin.routing';
import { UserAdminComponent } from './user-admin/user-admin.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [UserAdminComponent, HomeComponent],
  imports: [CommonModule, FormsModule, AdminRoutingModule],
})
export class AdminModule {}
