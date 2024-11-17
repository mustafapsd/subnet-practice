import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  SubnetCalculationForm,
  SubnetCalculationResult,
} from '../../models/subnet-calculation-form';
import { SubnetCalculationService } from '../../state/subnet-calculation.service';
import { AddressInputComponent } from '../address-input/address-input.component';

@Component({
  selector: 'app-subnet-calculation',
  standalone: true,
  imports: [AddressInputComponent, ReactiveFormsModule],
  templateUrl: './subnet-calculation.component.html',
  styleUrl: './subnet-calculation.component.scss',
})
export class SubnetCalculationComponent implements OnInit {
  subnetForm: FormGroup<SubnetCalculationForm> =
    new FormGroup<SubnetCalculationForm>({
      address: new FormControl<string>(''),
      subnetMask: new FormControl<string>(''),
      subnetMaskBits: new FormControl<number | null>(null),
      subnetwork: new FormControl<string>(''),
      subnetBroadcast: new FormControl<string>(''),
      firstMachine: new FormControl<string>(''),
      lastMachine: new FormControl<string>(''),
      mainNetwork: new FormControl<string>(''),
      nthMachine: new FormControl<number | null>(null),
      nthUsableSubnet: new FormControl<number | null>(null),
      subnetClass: new FormControl<string>(''),
      dividedNetworksCount: new FormControl<number | null>(null),
      machineCountPerSubnet: new FormControl<number | null>(null),
      result: new FormControl<SubnetCalculationResult>('valid'),
    } as SubnetCalculationForm);

  constructor(private subnetCalculationService: SubnetCalculationService) {}

  ngOnInit(): void {
    const initialValue = this.subnetCalculationService.getInitialFormValue();

    this.subnetForm.patchValue(initialValue);
  }

  checkResults(): void {
    const result = this.subnetCalculationService.subnetFinalResult;

    Object.keys(this.subnetForm.controls).forEach((objectKey) => {
      const key: keyof SubnetCalculationForm =
        objectKey as keyof SubnetCalculationForm;

      const isCorrect = this.subnetForm.get(key)?.value === result[key];

      this.subnetForm
        .get(key)
        ?.setErrors(isCorrect ? null : { falseResult: true });
    });
  }

  newQuestion(): void {
    this.subnetForm.reset();
    const initialValue = this.subnetCalculationService.getInitialFormValue();

    this.subnetForm.patchValue(initialValue);
  }
}
