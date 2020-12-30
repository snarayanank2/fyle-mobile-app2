
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { SavePopoverComponent } from './save-popover/save-popover.component';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { forkJoin, Observable, from, combineLatest } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { ExtendedOrgUser } from 'src/app/core/models/extended-org-user.model';
import * as moment from 'moment';
import { DateService } from 'src/app/core/services/date.service';

@Component({
  selector: 'app-add-edit-trips',
  templateUrl: './add-edit-trips.page.html',
  styleUrls: ['./add-edit-trips.page.scss'],
})
export class AddEditTripsPage implements OnInit {

  mode = 'add';
  tripTypes;
  minDate: string;
  maxDate: string;
  tripDate;
  hotelDate;
  fg: FormGroup;
  eou$: Observable<ExtendedOrgUser>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private popoverController: PopoverController,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private dateService: DateService
  ) { }

  async goBack() {
    const addExpensePopover = await this.popoverController.create({
      component: SavePopoverComponent,
      componentProps: {
        saveMode: 'CLOSE',
      },
      cssClass: 'dialog-popover'
    });
    await addExpensePopover.present();
    const { data } = await addExpensePopover.onDidDismiss();
    if (data && data.continue) {
      this.fg.reset();
      this.router.navigate(['/', 'enterprise', 'my_trips']);
    }
  }

  // getters
  get traveller_details() {
    return this.fg.get('traveller_details') as FormArray;
  }

  initializeTravelerDetails(eou) {
    const defaultUser = this.formBuilder.group({
      name: eou.us.full_name,
      phone_number:  eou.ou.mobile
    });
    this.traveller_details.push(defaultUser);
  }

  addNewTraveller() {
    const intialTraveler = this.formBuilder.group({
      name: [null],
      phone_number: [null]
    });
    this.traveller_details.push(intialTraveler);
  }

  removeTraveller(i) {
    this.traveller_details.removeAt(i);
  }

  initializeCities() {
    
  }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.params.id;
    this.mode = id ? 'edit' : 'add';

    this.tripTypes = [
      {
        value: 'ONE_WAY', label: 'One Way'
      }, {
        value: 'ROUND', label: 'Round Trip'
      }, {
        value: 'MULTI_CITY', label: 'Multi City'
      }
    ];

    this.tripDate = {
      startMin: moment(this.dateService.addDaysToDate(new Date(), -1)).format('y-MM-DD'),
      endMin: moment(this.dateService.addDaysToDate(new Date(), -1)).format('y-MM-DD'),
      departMin: moment(this.dateService.addDaysToDate(new Date(), -1)).format('y-MM-DD'),
      departMax: moment(this.dateService.addDaysToDate(new Date(), -1)).format('y-MM-DD')
    };

    this.hotelDate = {
      checkInMin: moment(this.dateService.addDaysToDate(new Date(), -1)).format('y-MM-DD'),
      checkInMax: moment(this.dateService.addDaysToDate(new Date(), -1)).format('y-MM-DD'),
      checkOutMin: moment(this.dateService.addDaysToDate(new Date(), -1)).format('y-MM-DD'),
    };

    this.minDate = moment(new Date()).format('y-MM-DD');

    this.fg = this.formBuilder.group({
      traveller_details: new FormArray([]),
      trip_type: ['ONE_WAY', Validators.required],
      start_date: [moment(new Date()).format('y-MM-DD'), Validators.required],
      end_date: [, Validators.required],
      purpose: [, Validators.required],
      cities: new FormArray([]),
      project: [],
      travel_agent: [],
      notes: [],
      transportationRequest: [],
      hotelRequest: [],
      advanceRequest: [],
      source: ['MOBILE'],
      custom_field_values: new FormArray([])
    });

    // add trips
    if (this.mode === 'add') {

      this.eou$ = from(this.authService.getEou());

      combineLatest([
        this.eou$
      ]).subscribe(([eou]) => {
        this.initializeTravelerDetails(eou);
        this.initializeCities();
        console.log('\n\n\n this.tripDate ->', this.tripDate);
      });
    } else {
      // edit trips
    }

    this.fg.controls.start_date.valueChanges.subscribe(() => {
      const startDate = this.fg.controls.start_date.value;
      const endDate = this.fg.controls.end_date.value;
      if (startDate) {
        this.tripDate.departMin = moment(this.dateService.addDaysToDate(startDate, -1)).format('y-MM-DD');
      }

      if (endDate) {
        this.tripDate.departMax = endDate;
      }
    });

    this.fg.controls.end_date.valueChanges.subscribe(() => {
      const startDate = this.fg.controls.start_date.value;
      const endDate = this.fg.controls.end_date.value;
      if (startDate) {
        this.tripDate.departMin = this.dateService.addDaysToDate(startDate.start_dt, -1);
      }

      if (endDate) {
        this.tripDate.departMax = endDate;
      }
    });
  }
}
