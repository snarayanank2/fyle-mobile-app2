import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CorporateCreditCardPageRoutingModule } from './corporate-credit-card-routing.module';

import { CorporateCreditCardPage } from './corporate-credit-card.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CorporateCreditCardPageRoutingModule
  ],
  declarations: [CorporateCreditCardPage]
})
export class CorporateCreditCardPageModule {}
