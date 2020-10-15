import { Pipe, PipeTransform } from '@angular/core';
import { getCurrencySymbol } from '@angular/common';

@Pipe({
  name: 'humanizeCurrency'
})
export class HumanizeCurrencyPipe implements PipeTransform {

  transform(amt: number, currencyCode: string, fraction: number): any {
    let sign = amt < 0 ? '-' : '';
    let amount = Math.abs(amt) || 0;
    let si = ['', 'K', 'M', 'G', 'T', 'P', 'H'];
    let exp = Math.max(0, Math.floor(Math.log(amount) / Math.log(1000)));
    let result = amount / Math.pow(1000, exp);
    let fixedResult;

    let currency = getCurrencySymbol(currencyCode, 'wide' , 'en');
    if (currency) {
      let fractionSize = fraction;
      if (fractionSize) {
        fixedResult = result.toFixed(fraction);
      } else {
         // will implemnt later if no fraction passed
      }
      fixedResult = currency + fixedResult;
    }

    fixedResult = fixedResult + si[exp];
    return sign + fixedResult;
  }

}
