import {Component, OnInit, forwardRef, Input, Injector} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl} from '@angular/forms';
import { noop } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { isEqual } from 'lodash';
import { FySelectModalComponent } from '../fy-select/fy-select-modal/fy-select-modal.component';
import { FyMultiselectModalComponent } from './fy-multiselect-modal/fy-multiselect-modal.component';

@Component({
  selector: 'app-fy-multiselect',
  templateUrl: './fy-multiselect.component.html',
  styleUrls: ['./fy-multiselect.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FyMultiselectComponent),
      multi: true
    }
  ]
})
export class FyMultiselectComponent implements OnInit, ControlValueAccessor {
  private ngControl: NgControl;
  @Input() options: { label: string, value: any }[] = [];
  @Input() disabled = false;
  @Input() label = '';
  @Input() mandatory = false;

  get valid() {
    if (this.ngControl.touched) {
      return this.ngControl.valid;
    } else {
      return true;
    }
  }

  private innerValue;
  displayValue;

  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  constructor(
    private modalController: ModalController,
    private injector: Injector
  ) { }

  ngOnInit() {
    this.ngControl = this.injector.get(NgControl);
  }

  get value(): any {
    return this.innerValue;
  }

  set value(v: any) {
    if (v !== this.innerValue) {
      this.innerValue = v;
      if (this.innerValue && this.innerValue.length > 0) {
        this.displayValue = this.innerValue
          .map(selectedValue => this.options.find(option => isEqual(option.value, selectedValue)))
          .map(option => option && option.label)
          .join(',');
      } else {
        this.displayValue = '';
      }

      this.onChangeCallback(v);
    }
  }

  async openModal() {
    const selectionModal = await this.modalController.create({
      component: FyMultiselectModalComponent,
      componentProps: {
        options: this.options,
        currentSelections: this.value
      }
    });

    await selectionModal.present();

    const { data } = await selectionModal.onWillDismiss();

    if (data) {
      console.log(data);
      this.value = data.selected.map(selection => selection.value);
    }
  }

  onBlur() {
    this.onTouchedCallback();
  }

  writeValue(value: any): void {
    if (value !== this.innerValue) {
      this.innerValue = value;
      if (this.innerValue && this.innerValue.length > 0) {
        this.displayValue = this.innerValue
          .map(selectedValue => this.options.find(option => isEqual(option.value, selectedValue)))
          .map(option => option && option.label)
          .join(',');
      } else {
        this.displayValue = '';
      }
    }
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }
}
