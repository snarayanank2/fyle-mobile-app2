import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddEditTripsPage } from './add-edit-trips.page';

describe('AddEditTripsPage', () => {
  let component: AddEditTripsPage;
  let fixture: ComponentFixture<AddEditTripsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditTripsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddEditTripsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
