import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit, ElementRef, Input } from '@angular/core';
import { AgmGeocoder } from '@agm/core';
import { map, startWith, distinctUntilChanged, switchMap, debounceTime, tap, finalize, catchError } from 'rxjs/operators';
import { ModalController } from '@ionic/angular';
import { Observable, fromEvent, of, from, forkJoin, noop, throwError} from 'rxjs';
import { LocationService } from 'src/app/core/services/location.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoaderService } from 'src/app/core/services/loader.service';

@Component({
  selector: 'app-fy-location-modal',
  templateUrl: './fy-location-modal.component.html',
  styleUrls: ['./fy-location-modal.component.scss'],
})
export class FyLocationModalComponent implements OnInit, AfterViewInit {

  @Input() currentSelection: any;
  @Input() header = '';
  loader = false;
  value = '';
  lookupFailed = false;

  @ViewChild('searchBar') searchBarRef: ElementRef;

  filteredList$: Observable<any[]>;

  constructor(
    private agmGeocode: AgmGeocoder,
    private modalController: ModalController,
    private cdr: ChangeDetectorRef,
    private locationService: LocationService,
    private authService: AuthService,
    private loaderService: LoaderService
  ) { }

  ngOnInit() {
  }

  clearValue() {
    /** 
     * this.value is ng-model of search field. On click of clear button, clearValue() method will be called
     * this.value is set to empty string 
     */ 
    this.value = '';
    // get search input element
    const searchInput = this.searchBarRef.nativeElement as HTMLInputElement;
    // set value shown on UI to empty string
    searchInput.value = '';
    // manually dispatch `keyup` event to filter the list again because filter logic runs on keyup event of search input element
    searchInput.dispatchEvent(new Event('keyup'));
  }

  ngAfterViewInit() {
    const that = this;
    if (that.currentSelection && that.currentSelection.display) {
      this.value = that.currentSelection.display;
    }

    that.filteredList$ = fromEvent(that.searchBarRef.nativeElement, 'keyup').pipe(
      map((event: any) => event.srcElement.value),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((searchText) => {
        if (searchText && searchText.length > 0) {
          that.loader = true;
          return forkJoin({
            eou: that.authService.getEou(),
            currentLocation: that.locationService.getCurrentLocation({enableHighAccuracy: false})
          }).pipe(
            switchMap(({eou, currentLocation }) => {
              if (currentLocation) {
                return that.locationService.getAutocompletePredictions(searchText, eou.us.id, `${currentLocation.coords.latitude},${currentLocation.coords.longitude}`);
              } else {
                return that.locationService.getAutocompletePredictions(searchText, eou.us.id);
              }
            }),
            map((res) => {
              that.loader = false;
              return res;
            }),
            catchError(() => {
              that.loader = false;
              that.lookupFailed = true;
              return [];
            })
          );
        } else {
          return of(null);
        }
      }),
    );

    that.filteredList$.subscribe(noop);

    that.cdr.detectChanges();
  }

  onDoneClick() {
    let value;
    if (this.currentSelection && (this.value === this.currentSelection)) {
      value = this.currentSelection;
    } else if (this.value && this.value !== '') {
      value = {display: this.value};
    } else {
      value = null;
    }

    this.modalController.dismiss({
      selection: value
    });
  }

  onElementSelect(location) {
    this.locationService.getGeocode(location.place_id, location.description).subscribe(selection => {
      this.modalController.dismiss({
        selection
      });
    });
  }

  deleteLocation() {
    this.modalController.dismiss({
      selection: null
    });
  }

  formatGeocodeResponse(geocodeResponse) {
    const currentLocation = geocodeResponse && geocodeResponse.length > 0 && geocodeResponse[0];
    if (!currentLocation) {
      return;
    }

    const formattedLocation: any = {
      display: currentLocation.formatted_address, // geocodeResponse doesn't return display
      formatted_address: currentLocation.formatted_address
    };

    if (currentLocation.geometry && currentLocation.geometry.location) {
      formattedLocation.latitude = currentLocation.geometry.location.lat();
      formattedLocation.longitude = currentLocation.geometry.location.lng();
    }

    currentLocation.address_components.forEach((component) => {
      if (component.types.indexOf('locality') > -1) {
        formattedLocation.city = component.long_name;
      }

      if (component.types.indexOf('administrative_area_level_1') > -1) {
        formattedLocation.state = component.long_name;
      }

      if (component.types.indexOf('country') > -1) {
        formattedLocation.country = component.long_name;
      }
    });
    return formattedLocation;
  }

  getCurrentLocation() {
    from(this.loaderService.showLoader('Loading current location...', 5000)).pipe(
      switchMap(() => {
        return this.locationService.getCurrentLocation({enableHighAccuracy: true});
      }),
      switchMap((coordinates) => {
        return this.agmGeocode.geocode({
          location: {
            lat: coordinates.coords.latitude,
            lng: coordinates.coords.longitude
          }
        });
      }),
      map(this.formatGeocodeResponse),
      catchError((err) => {
        this.lookupFailed = true;
        return throwError(err);
      }),
      finalize(() => from(this.loaderService.hideLoader()))
    ).subscribe((selection) => {
      this.modalController.dismiss({
        selection
      });
    });
  }

}
