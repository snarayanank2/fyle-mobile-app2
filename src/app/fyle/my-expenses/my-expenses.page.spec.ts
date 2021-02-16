import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule, ModalController, PopoverController} from '@ionic/angular';

import {MyExpensesPage} from './my-expenses.page';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MyExpensesPageRoutingModule} from './my-expenses-routing.module';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatRadioModule} from '@angular/material/radio';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatIconModule} from '@angular/material/icon';
import {SharedModule} from '../../shared/shared.module';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {NetworkService} from '../../core/services/network.service';
import {LoaderService} from '../../core/services/loader.service';
import {DateService} from '../../core/services/date.service';
import {TransactionService} from '../../core/services/transaction.service';
import {CurrencyService} from '../../core/services/currency.service';
import {ActivatedRoute, Router} from '@angular/router';
import {TransactionsOutboxService} from '../../core/services/transactions-outbox.service';
import {OfflineService} from '../../core/services/offline.service';
import {PopupService} from '../../core/services/popup.service';
import {TrackingService} from '../../core/services/tracking.service';
import {StorageService} from '../../core/services/storage.service';
import {TokenService} from '../../core/services/token.service';
import {ApiV2Service} from '../../core/services/api-v2.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {of} from 'rxjs';

xdescribe('MyExpensesPage', () => {
  let component: MyExpensesPage;
  let fixture: ComponentFixture<MyExpensesPage>;
  let networkServiceMock: any;
  let loaderServiceMock: any;
  let modalControllerMock: any;
  let dateServiceMock: any;
  let transactionServiceMock: any;
  let currencyServiceMock: any;
  let popoverControllerMock: any;
  let routerMock: any;
  let transactionsOutboxServiceMock: any;
  let activatedRouteMock: any;
  let offlineServiceMock: any;
  let popupServiceMock: any;
  let trackingServiceMock: any;
  let storageServiceMock: any;
  let tokenServiceMock: any;
  let apiV2ServiceMock: any;
  const setDafaultConditions = () => {
    networkServiceMock.connectivityWatcher.and.returnValue(of(true));
    networkServiceMock.isOnline.and.returnValue(true);
    loaderServiceMock.showLoader.and.returnValue(new Promise((resolve) => resolve()));
    loaderServiceMock.hideLoader.and.returnValue(new Promise((resolve) => resolve()));
  };

  beforeEach(async(() => {
    networkServiceMock = jasmine.createSpyObj('NetworkService', ['connectivityWatcher', 'isOnline']);
    loaderServiceMock = jasmine.createSpyObj('LoaderService', ['showLoader', 'hideLoader']);
    modalControllerMock = jasmine.createSpyObj('ModalController', ['create']);
    dateServiceMock = jasmine.createSpyObj('DateService', ['getThisMonthRange', 'getLastMonthRange']);
    transactionServiceMock = jasmine.createSpyObj('TransactionService',
      ['delete', 'getAllExpenses', 'getETxn', 'getMyExpensesCount', 'getMyExpenses', 'getPaginatedETxncCount']
    );
    currencyServiceMock = jasmine.createSpyObj('CurrencyService', ['getHomeCurrency']);
    popoverControllerMock = jasmine.createSpyObj('PopoverController', ['create']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    transactionsOutboxServiceMock = jasmine.createSpyObj('TransactionsOutboxService', ['getPendingTransactions', 'sync']);
    activatedRouteMock = jasmine.createSpyObj('ActivatedRoute', ['getSnapshot']);
    offlineServiceMock = jasmine.createSpyObj('OfflineService', ['getOrgUserSettings', 'getOrgSettings']);
    popupServiceMock = jasmine.createSpyObj('PopupService', ['showPopup']);
    trackingServiceMock = jasmine.createSpyObj('TrackingService', ['createFirstExpense', 'deleteExpense', 'clickAddToReport', 'addToReport', 'clickCreateReport']);
    storageServiceMock = jasmine.createSpyObj('StorageService', ['get', 'set']);
    tokenServiceMock = jasmine.createSpyObj('TokenService', ['getClusterDomain']);
    apiV2ServiceMock = jasmine.createSpyObj('ApiV2Service', ['extendQueryParamsForTextSearch']);


    TestBed.configureTestingModule({
      declarations: [
        MyExpensesPage,
      ],
      imports: [
        IonicModule.forRoot(),
        CommonModule,
        FormsModule,
        MyExpensesPageRoutingModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        MatRadioModule,
        FormsModule,
        ReactiveFormsModule,
        MatRippleModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatIconModule,
        SharedModule,
        NoopAnimationsModule,
        HttpClientTestingModule
      ],
      providers: [
        {
          provide: NetworkService,
          useValue: networkServiceMock
        },
        {
          provide: LoaderService,
          useValue: loaderServiceMock
        },
        {
          provide: ModalController,
          useValue: modalControllerMock
        },
        {
          provide: DateService,
          useValue: dateServiceMock
        },
        {
          provide: TransactionService,
          useValue: transactionServiceMock
        },
        {
          provide: CurrencyService,
          useValue: currencyServiceMock
        },
        {
          provide: PopoverController,
          useValue: popoverControllerMock
        },
        {
          provide: Router,
          useValue: routerMock
        },
        {
          provide: TransactionsOutboxService,
          useValue: transactionsOutboxServiceMock
        },
        {
          provide: ActivatedRoute,
          useValue: activatedRouteMock
        },
        {
          provide: OfflineService,
          useValue: offlineServiceMock
        },
        {
          provide: PopupService,
          useValue: popupServiceMock
        },
        {
          provide: TrackingService,
          useValue: trackingServiceMock
        },
        {
          provide: StorageService,
          useValue: storageServiceMock
        },
        {
          provide: TokenService,
          useValue: tokenServiceMock
        },
        {
          provide: ApiV2Service,
          useValue: apiV2ServiceMock
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MyExpensesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    networkServiceMock.connectivityWatcher.and.returnValue(of(false));
    networkServiceMock.isOnline.and.returnValue(false);

    expect(component).toBeTruthy();
  });
});
