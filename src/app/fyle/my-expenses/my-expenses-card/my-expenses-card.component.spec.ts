import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {MyExpensesCardComponent} from './my-expenses-card.component';
import {ReportService} from '../../../core/services/report.service';
import {Expense} from '../../../core/models/expense.model';
import {of} from 'rxjs';
import {SharedModule} from '../../../shared/shared.module';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MyExpensesPageRoutingModule} from '../my-expenses-routing.module';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatRadioModule} from '@angular/material/radio';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatIconModule} from '@angular/material/icon';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';


describe('MyExpensesCardComponent', () => {
  let component: MyExpensesCardComponent;
  let fixture: ComponentFixture<MyExpensesCardComponent>;

  const sampleEtxn: Expense = {
    transaction_approvals: undefined,
    tx_categoryDisplayName: '',
    tx_updated_at: undefined,
    tx_risk_state: null,
    tx_is_duplicate_expense: null,
    ou_org_name: 'Fyle Staging',
    tx_id: 'txAOPL9TnoIR',
    tx_org_user_id: 'ouCI4UQ2G0K1',
    tx_created_at: new Date('2021-02-15T15:34:17.014Z'),
    tx_receipt_required: false,
    tx_user_can_delete: true,
    tx_txn_dt: new Date('2021-02-15T06:30:00.000Z'),
    tx_category: null,
    tx_amount: 2400,
    tx_user_amount: 2400,
    tx_policy_amount: null,
    tx_admin_amount: null,
    tx_tax: null,
    tx_currency: 'INR',
    tx_report_id: null,
    tx_reported_at: null,
    tx_state: 'COMPLETE',
    tx_num_files: 0,
    tx_invoice_number: null,
    tx_purpose: null,
    tx_source: 'MOBILE',
    tx_billable: false,
    tx_orig_amount: 200,
    tx_orig_currency: 'ANG',
    tx_project_id: 519,
    tx_project_name: 'Haldiram-1',
    tx_project_code: '123',
    tx_skip_reimbursement: false,
    tx_creator_id: 'ouCI4UQ2G0K1',
    tx_user_reason_for_duplicate_expenses: null,
    tx_external_id: null,
    tx_cost_center_name: 'a3',
    tx_cost_center_code: '1',
    tx_cost_center_id: 2422,
    tx_source_account_id: 'accfziaxbGFVW',
    tx_transcription_state: null,
    tx_verification_state: null,
    tx_physical_bill: null,
    tx_physical_bill_at: null,
    tx_policy_state: null,
    tx_manual_flag: null,
    tx_policy_flag: null,
    rp_purpose: null,
    rp_approved_at: null,
    rp_reimbursed_at: null,
    rp_claim_number: null,
    ou_id: 'ouCI4UQ2G0K1',
    ou_org_id: 'orrjqbDbeP9p',
    ou_user_id: 'usvKA4X8Ugcr',
    ou_employee_id: 'A',
    ou_location: 'bangalore',
    ou_level: '1',
    ou_band: null,
    ou_rank: 1,
    ou_business_unit: null,
    ou_department_id: 'deptSdAUA5Urej',
    ou_department: 'Primary Sales',
    ou_title: 'lion',
    ou_mobile: '+919535079878',
    ou_sub_department: 'Primary Sales',
    ou_joining_dt: '2018-12-06T00:00:00.000+0000',
    us_full_name: 'Abhishek',
    us_email: 'ajain@fyle.in',
    tx_vendor: '1212',
    tx_vendor_id: 1384,
    source_account_type: 'PERSONAL_ACCOUNT',
    source_account_id: 'accfziaxbGFVW',
    tx_org_category: 'MaheshTest',
    tx_sub_category: 'a',
    tx_fyle_category: 'Food',
    tx_org_category_code: '141848',
    tx_org_category_id: 64125,
    external_expense_source: null,
    external_expense_id: null,
    tx_expense_number: 'E/2021/02/T/166',
    tx_corporate_credit_card_expense_group_id: null,
    tx_split_group_id: 'txAOPL9TnoIR',
    tx_split_group_user_amount: 2400,
    tx_extracted_data: null,
    tx_transcribed_data: null,
    tx_user_review_needed: null,
    tx_mandatory_fields_present: true,
    tx_distance: null,
    tx_distance_unit: 'KM',
    tx_from_dt: null,
    tx_to_dt: null,
    tx_num_days: null,
    tx_mileage_calculated_distance: null,
    tx_mileage_calculated_amount: null,
    tx_mileage_vehicle_type: null,
    tx_mileage_rate: null,
    tx_mileage_is_round_trip: null,
    tx_hotel_is_breakfast_provided: null,
    tx_flight_journey_travel_class: null,
    tx_flight_return_travel_class: null,
    tx_train_travel_class: null,
    tx_bus_travel_class: null,
    tx_per_diem_rate_id: null,
    tx_activity_policy_pending: null,
    tx_activity_details: null,
    tx_locations: [],
    tx_custom_properties: [
      {
        name: 'Group',
        value: []
      },
      {
        name: 'Hell Dell',
        value: null
      },
      {
        name: 'Alcohol Test',
        value: 'asdad'
      },
      {
        name: 'locationnew aut',
        value: null
      },
      {
        name: 'TestingCustomFields',
        value: null
      },
      {
        name: 'sample',
        value: null
      },
      {
        name: 'official',
        value: false
      },
      {
        name: 'ASEEM BOOLEAN',
        value: false
      }
    ]
  };

  let reportService: any;

  beforeEach(async(() => {
    reportService = jasmine.createSpyObj('ReportService', ['getAllOpenReportsCount']);
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        IonicModule,
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
        HttpClientModule,
        BrowserAnimationsModule
      ],
      declarations: [MyExpensesCardComponent],
      providers: [
        {
          provide: ReportService,
          useValue: reportService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MyExpensesCardComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    reportService.getAllOpenReportsCount.and.returnValue(of(0));

    component.expense = sampleEtxn;
    fixture.detectChanges();
    expect(component).toBeTruthy();
    const componentNativeElemnt = fixture.nativeElement as HTMLElement;

    expect(componentNativeElemnt.querySelector('.icon-container .mat-icon').getAttribute('svgicon')).toBe('food');
    expect(componentNativeElemnt.querySelector('.my-expenses-card--currency').textContent.trim()).toBe('INR');
    expect(componentNativeElemnt.querySelector('.my-expenses-card--amount').textContent.trim()).toBe('2,400.00');
    expect(componentNativeElemnt.querySelector('.my-expenses-card--more').textContent.trim()).toBeTruthy();
  });

  it('should not show open card button when can open card is false', () => {
    reportService.getAllOpenReportsCount.and.returnValue(of(0));

    component.expense = sampleEtxn;
    component.canOpenCard = false;

    fixture.detectChanges();
    expect(component).toBeTruthy();
    const componentNativeElemnt = fixture.nativeElement as HTMLElement;
    expect(componentNativeElemnt.querySelector('.my-expenses-card--more')).toBeFalsy();
  });

  it('should not show open card button when selectionMode is on', () => {
    reportService.getAllOpenReportsCount.and.returnValue(of(0));

    component.expense = sampleEtxn;
    component.canOpenCard = false;

    fixture.detectChanges();
    expect(component).toBeTruthy();
    const componentNativeElemnt = fixture.nativeElement as HTMLElement;
    expect(componentNativeElemnt.querySelector('.my-expenses-card--more')).toBeFalsy();
  });
});
