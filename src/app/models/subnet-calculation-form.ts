import { FormControl } from '@angular/forms';

export type SubnetCalculationResult =
  | 'valid'
  | 'machineAddressIsSubnetAddress'
  | 'machineAddressIsBroadcastAddress'
  | 'subnetBitsInNetworkAddressIsAllOnes'
  | 'zerothSubnet';

export interface SubnetCalculationForm {
  address: FormControl<string>;
  subnetMask: FormControl<string>;
  subnetwork: FormControl<string>;
  subnetBroadcast: FormControl<string>;
  firstMachine: FormControl<string>;
  lastMachine: FormControl<string>;
  mainNetwork: FormControl<string>;
  nthMachine: FormControl<number>;
  nthUsableSubnet: FormControl<number>;
  subnetClass: FormControl<string>;
  dividedNetworksCount: FormControl<number>;
  machineCountPerSubnet: FormControl<number>;
  result: FormControl<SubnetCalculationResult>;
}

export interface SubnetCalculationFormValue {
  address: string;
  subnetMask: string;
  subnetMaskBits: number;
  subnetwork: string;
  subnetBroadcast: string;
  firstMachine: string;
  lastMachine: string;
  mainNetwork: string;
  nthMachine: number;
  nthUsableSubnet: number;
  subnetClass: string;
  dividedNetworksCount: number;
  machineCountPerSubnet: number;
  result: SubnetCalculationResult;
}
