import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
  selector: 'app-address-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './address-input.component.html',
  styleUrl: './address-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: AddressInputComponent,
      multi: true,
    },
  ],
})
export class AddressInputComponent implements ControlValueAccessor, OnChanges {
  @Input() address = '';
  @Output() addressChange: EventEmitter<string> = new EventEmitter<string>();

  @Input() disabled = false;

  octets: Record<string, number | null> = {
    octet1: null,
    octet2: null,
    octet3: null,
    octet4: null,
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['address']) {
      this.writeValue(this.address);
    }
  }

  writeValue(address: string): void {
    if (!address) {
      this.octets = {
        octet1: null,
        octet2: null,
        octet3: null,
        octet4: null,
      };
      return;
    }

    const octets = address.split('.');

    octets.forEach((octet, index) => {
      this.octets[`octet${index + 1}`] = Number(octet);
    });
  }

  registerOnChange(fn: (address: string) => void): void {
    this.addressChange.subscribe(fn);
  }

  registerOnTouched(fn: () => void): void {
    this.addressChange.subscribe(fn);
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
