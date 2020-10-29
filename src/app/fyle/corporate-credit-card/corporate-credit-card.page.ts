import { Component, OnInit } from '@angular/core';
import { TransactionService } from 'src/app/core/services/transaction.service';
import { CorporateCreditCardExpenseService } from 'src/app/core/services/corporate-credit-card-expense.service';

@Component({
  selector: 'app-corporate-credit-card',
  templateUrl: './corporate-credit-card.page.html',
  styleUrls: ['./corporate-credit-card.page.scss'],
})
export class CorporateCreditCardPage implements OnInit {

  constructor(
    private transactionService: TransactionService,
    private corporateCreditCardExpenseService: CorporateCreditCardExpenseService
  ) { }

  ngOnInit() {

    // const myETxnc$ = this.transactionService.getMyETxnc();
    // const eCCCExpenses$ = this.corporateCreditCardExpenseService.getMyEcccec();

    // const primaryData$ = forkJoin({
    //   myETxnc$,
    //   orgSettings$
    // });

    // primaryData$.subscribe((res) => {
    //   this.originalETxnc = res.myETxnc$;
    //   this.orgSettings = res.orgSettings$;
    // });

    // var promises = {
    //   myETxnc: TransactionService.getMyETxnc(),
    //   eCCCExpenses: CorporateCreditCardExpenseService.getMyEcccec()
    // };

    // $q.all(promises).then(function (result) {
    //   $ionicLoading.hide();
    //   originalETxnc = result.myETxnc;
    //   allCcceExpenses = result.eCCCExpenses.extendedCCCExpenses;

    //   getMatchingETxnc(allCcceExpenses);

    //   reset();
    // });
  }

}
