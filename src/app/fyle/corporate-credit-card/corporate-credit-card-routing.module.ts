import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CorporateCreditCardPage } from './corporate-credit-card.page';

const routes: Routes = [
  {
    path: '',
    component: CorporateCreditCardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CorporateCreditCardPageRoutingModule {}
