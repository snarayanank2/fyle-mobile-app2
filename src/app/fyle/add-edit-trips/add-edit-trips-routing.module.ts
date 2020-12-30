import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddEditTripsPage } from './add-edit-trips.page';

const routes: Routes = [
  {
    path: '',
    component: AddEditTripsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddEditTripsPageRoutingModule {}
