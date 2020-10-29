import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { ApiV2Service } from './api-v2.service';

@Injectable({
  providedIn: 'root'
})
export class CorporateCreditCardExpenseService {

  constructor(
    private apiService: ApiService,
    private apiV2Service: ApiV2Service
  ) { }

  getPaginatedECorporateCreditCardExpenseStats(params) {
    return this.apiService.get('/extended_corporate_credit_card_expenses/stats', {params});
  }

  getMyEcccec() {
    // return this.apiV2Service.get('/extended_corporate_credit_card_expenses').pipe(

    // )
    // return APIService.get('/extended_corporate_credit_card_expenses').then(function (expenses) {
    //   return ExtendedCCCECollection.parseRaw(expenses);
    // }, function (err) {
    //   console.log(err);
    // });
  }

}
