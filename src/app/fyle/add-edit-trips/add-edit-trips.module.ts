import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AddEditTripsPageRoutingModule } from './add-edit-trips-routing.module';
import { AddEditTripsPage } from './add-edit-trips.page';
import { SharedModule } from '../../shared/shared.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { FySelectProjectComponent } from '../add-edit-expense/fy-select-project/fy-select-project.component';
import { SavePopoverComponent } from './save-popover/save-popover.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddEditTripsPageRoutingModule,
    SharedModule,
    MatCheckboxModule,
    MatTabsModule,
    ReactiveFormsModule
  ],
  declarations: [
    AddEditTripsPage,
    FySelectProjectComponent,
    SavePopoverComponent
  ]
})
export class AddEditTripsPageModule {}
