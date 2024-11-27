import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
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

  @ViewChild('addressInput') addressInput!: ElementRef<HTMLElement>;

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

  onKeyDown(event: KeyboardEvent, octet: string): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;

    if (event.key === 'Tab') {
      return;
    }

    if (event.key === 'Backspace') {
      if (this.octets[octet] === null) {
        this.focusPreviousOctet(octet);
      }
      return;
    }

    if (event.key === '.') {
      event.preventDefault();
      this.focusNextOctet(octet);
      return;
    }

    if (event.key === 'ArrowLeft') {
      this.focusPreviousOctet(octet);
      return;
    }

    if (event.key === 'ArrowRight') {
      this.focusNextOctet(octet);
      return;
    }

    if (value.length === 3) {
      this.focusNextOctet(octet);
    }
  }

  focusNextOctet(octet: string): void {
    const octetNumber = Number(octet.replace('octet', ''));
    const nextOctet = `octet${octetNumber + 1}`;

    if (this.octets[nextOctet] === null) {
      this.focusElement(nextOctet);
    }
  }

  focusPreviousOctet(octet: string): void {
    const octetNumber = Number(octet.replace('octet', ''));
    const previousOctet = `octet${octetNumber - 1}`;

    if (this.octets[previousOctet] === null) {
      this.focusElement(previousOctet);
    }
  }

  focusElement(elementId: string): void {
    const mainElement = this.addressInput.nativeElement;
    const element = mainElement.querySelector(`#${elementId}`) as HTMLElement;

    if (element) {
      element.focus();
    }
  }

  updateValue() {
    const octets = Object.values(this.octets)
      .map((octet) => (octet === null ? '' : octet))
      .join('.');

    this.addressChange.emit(octets);
  }
}
