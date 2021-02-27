import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {Plugins} from '@capacitor/core';
import {CurrencyService} from './currency.service';
import {map} from 'rxjs/operators';

const {Device} = Plugins;


@Injectable({
  providedIn: 'root'
})
export class NPSService {

  constructor(
    private authService: AuthService,
    private currencyService: CurrencyService
  ) {
  }

  private canStartSurvey(homeCurrency) {
    // return homeCurrency && homeCurrency === 'USD';
    return true;
  }

  startSurvey(properties, options) {
    if (typeof (window as any).delighted !== 'undefined' && (window as any).delighted !== null) {
      return this.currencyService.getHomeCurrency().subscribe(async (currency) => {
        if (this.canStartSurvey(currency)) {
          const that = this;
          const eou = await that.authService.getEou();
          let device = '';
          const info = await Device.getInfo();

          if (info.operatingSystem === 'ios') {
            device = 'IOS';
          } else if (info.operatingSystem === 'android') {
            device = 'ANDROID';
          }

          var delightedProperties = {};

          delightedProperties['India / International'] = 'International Americas';
          delightedProperties['Delighted Email Subject'] = '';
          delightedProperties['Company ID'] = eou.ou.org_id;
          delightedProperties['Company Name'] = eou.ou.org_name;
          delightedProperties['Admin'] = eou.ou.roles.indexOf('ADMIN') > -1 ? 'T' : 'F';
          delightedProperties['Lite'] = 'F';
          delightedProperties['Device'] = device
          if (properties) {
            Object.assign(delightedProperties, properties);
          }

          var delightedOptions = {
            email: eou.us.email,
            name: eou.us.full_name,
            createdAt: eou.us.created_at,
            properties: delightedProperties
          };
          if (options) {
            Object.assign(delightedOptions, options);
          }
          console.log("Delighted User", delightedOptions);
          return navigator.sendBeacon((window as any).delighted.survey(delightedOptions));
        }
      });
    }
  };
}
