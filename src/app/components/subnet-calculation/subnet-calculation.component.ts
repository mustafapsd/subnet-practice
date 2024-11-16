import { Component, Input, OnInit } from '@angular/core';
import { AddressInputComponent } from '../address-input/address-input.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SubnetCalculationForm } from '../../models/subnet-calculation-form';
import { SubnetCalculationService } from '../../state/subnet-calculation.service';

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
      subnetMaskBits: new FormControl<number>(0),
      subnetwork: new FormControl<string>(''),
      subnetBroadcast: new FormControl<string>(''),
      firstMachine: new FormControl<string>(''),
      lastMachine: new FormControl<string>(''),
      mainNetwork: new FormControl<string>(''),
      nthMachine: new FormControl<number>(0),
      nthUsableSubnet: new FormControl<number>(0),
      subnetClass: new FormControl<string>(''),
      dividedNetworksCount: new FormControl<number>(0),
      machineCountPerSubnet: new FormControl<number>(0),
      result: new FormControl<string>('valid'),
    } as SubnetCalculationForm);

  constructor(private subnetCalculationService: SubnetCalculationService) {}

  ngOnInit(): void {
    const initialValue = this.subnetCalculationService.getInitialFormValue();

    this.subnetForm.patchValue(initialValue);
  }
}
