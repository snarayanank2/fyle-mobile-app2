import { Component, OnInit, forwardRef, Input, ContentChild, TemplateRef, ElementRef, OnDestroy, Injector } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, NG_VALIDATORS, FormControl, NgControl } from '@angular/forms';
import { noop } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { FySelectModalComponent } from './fy-select-modal/fy-select-modal.component';
import { isEqual } from 'lodash';

@Component({
  selector: 'app-fy-select',
  templateUrl: './fy-select.component.html',
  styleUrls: ['./fy-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FySelectComponent),
      multi: true
    },
    // {
    //   provide: NG_VALIDATORS,
    //   useExisting: FySelectComponent,
    //   multi: true
    // }
  ]
})
export class FySelectComponent implements ControlValueAccessor, OnInit, OnDestroy {
  private ngControl: NgControl;
  @Input() options: { label: string, value: any }[] = [];
  @Input() disabled = false;
  @Input() label = '';
  @Input() mandatory = false;
  @Input() selectionElement: TemplateRef<any>;
  @Input() nullOption = true;

  private innerValue;
  displayValue;

  get valid() {
    if (this.ngControl.touched) {
      return this.ngControl.valid;
    } else {
      return true;
    }
  }

  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  constructor(
    private modalController: ModalController,
    private injector: Injector
  ) { }

  ngOnInit() {
    this.ngControl = this.injector.get(NgControl);
  }

  ngOnDestroy(): void {
    // this.ngControl.control.clearValidators();
    // this.ngControl.control.updateValueAndValidity();
  }

  get value(): any {
    return this.innerValue;
  }

  set value(v: any) {
    if (v !== this.innerValue) {
      this.innerValue = v;
      if (this.options) {
        const selectedOption = this.options.find(option => isEqual(option.value, this.innerValue));
        if (selectedOption) {
          this.displayValue = selectedOption && selectedOption.label;
        }
      }

      this.onChangeCallback(v);
    }
  }

  async openModal() {
    const selectionModal = await this.modalController.create({
      component: FySelectModalComponent,
      componentProps: {
        options: this.options,
        currentSelection: this.value,
        selectionElement: this.selectionElement,
        nullOption: this.nullOption
      }
    });

    await selectionModal.present();

    const { data } = await selectionModal.onWillDismiss();

    if (data) {
      this.value = data.value;
    }
  }

  onBlur() {
    console.log('Blurrrred');
    this.onTouchedCallback();
  }

  writeValue(value: any): void {
    if (value !== this.innerValue) {
      this.innerValue = value;
      if (this.options) {
        const selectedOption = this.options.find(option => isEqual(option.value, this.innerValue));
        this.displayValue = selectedOption && selectedOption.label;
      }
    }
  }

  // validate(fc: FormControl) {
  //   if (this.mandatory && fc.value === null) {
  //     return {
  //       required: true
  //     };
  //   }
  // }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }
}