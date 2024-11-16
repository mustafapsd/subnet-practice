import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {
  SubnetCalculationFormValue,
  SubnetCalculationResult,
} from '../models/subnet-calculation-form';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SubnetCalculationInitialCombinations } from '../models/subnet-calculation-start';

@Injectable({
  providedIn: 'root',
})
export class SubnetCalculationService {
  subnetCalculationForm$ = new Subject<SubnetCalculationFormValue>();
  subnetFinalResult!: SubnetCalculationFormValue;

  constructor() {
    this.subnetCalculationForm$
      .pipe(takeUntilDestroyed())
      .subscribe((formValue) => {
        console.log('Received form value:', formValue);
      });
  }

  getInitialFormValue(): Partial<SubnetCalculationFormValue> {
    const initialFormType = this.getRandomNumber(0, 7);
    this.calculateResult();

    switch (initialFormType) {
      case SubnetCalculationInitialCombinations.AddressAndSubnetMask:
        return {
          address: this.subnetFinalResult.address,
          subnetMask: this.subnetFinalResult.subnetMask,
        };
      case SubnetCalculationInitialCombinations.AddressAndSubnetMaskBits:
        return {
          address: this.subnetFinalResult.address,
          subnetMaskBits: this.subnetFinalResult.subnetMaskBits,
        };
      case SubnetCalculationInitialCombinations.SubnetAddressAndSubnetMaskAndMachineNumber:
        return {
          subnetwork: this.subnetFinalResult.subnetwork,
          subnetMask: this.subnetFinalResult.subnetMask,
          nthMachine: this.subnetFinalResult.nthMachine,
        };
      case SubnetCalculationInitialCombinations.SubnetAddressAndSubnetMaskBitsAndMachineNumber:
        return {
          subnetwork: this.subnetFinalResult.subnetwork,
          subnetMaskBits: this.subnetFinalResult.subnetMaskBits,
          nthMachine: this.subnetFinalResult.nthMachine,
        };
      case SubnetCalculationInitialCombinations.MainNetAndSubnetMaskAndSubnetNumberAndMachineNumber:
        return {
          mainNetwork: this.subnetFinalResult.mainNetwork,
          subnetMask: this.subnetFinalResult.subnetMask,
          nthUsableSubnet: this.subnetFinalResult.nthUsableSubnet,
          nthMachine: this.subnetFinalResult.nthMachine,
        };
      case SubnetCalculationInitialCombinations.MainNetAndSubnetMaskBitsAndSubnetNumberAndMachineNumber:
        return {
          mainNetwork: this.subnetFinalResult.mainNetwork,
          subnetMaskBits: this.subnetFinalResult.subnetMaskBits,
          nthUsableSubnet: this.subnetFinalResult.nthUsableSubnet,
          nthMachine: this.subnetFinalResult.nthMachine,
        };
      case SubnetCalculationInitialCombinations.MainNetAndSubnetNumberAndMinNumberOfMachinesParSubnetAndMachineNumber:
        return {
          mainNetwork: this.subnetFinalResult.mainNetwork,
          nthUsableSubnet: this.subnetFinalResult.nthUsableSubnet,
          machineCountPerSubnet: this.subnetFinalResult.machineCountPerSubnet,
          nthMachine: this.subnetFinalResult.nthMachine,
        };
      case SubnetCalculationInitialCombinations.MainNetAndSubnetNumberAndMinNumberOfSubnetsAndMachineNumber:
        return {
          mainNetwork: this.subnetFinalResult.mainNetwork,
          nthUsableSubnet: this.subnetFinalResult.nthUsableSubnet,
          dividedNetworksCount: this.subnetFinalResult.dividedNetworksCount,
          nthMachine: this.subnetFinalResult.nthMachine,
        };
      default:
        return {};
    }
  }

  private getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private getRandomAddressWithSubnetMask() {
    return {
      address: `${this.getRandomNumber(1, 255)}.${this.getRandomNumber(
        0,
        255
      )}.${this.getRandomNumber(0, 255)}.${this.getRandomNumber(0, 255)}`,
      subnetMask: `${this.getRandomNumber(0, 255)}.${this.getRandomNumber(
        0,
        255
      )}.${this.getRandomNumber(0, 255)}.${this.getRandomNumber(0, 255)}`,
    };
  }

  private calculateResult() {
    let result;
    let address;
    let subnetMask;

    while (true) {
      try {
        const randomAddresses = this.getRandomAddressWithSubnetMask();
        address = randomAddresses.address;
        subnetMask = randomAddresses.subnetMask;
        result = this.calculateNetworkInfo(address, subnetMask);
        break; // Exit the loop if no error is thrown
      } catch (error) {
        // Optionally log the error or handle it
        console.error('Error calculating network info:', error);
      }
    }

    this.subnetFinalResult = {
      address,
      subnetMask,
      subnetMaskBits: result.subnetMaskBits,
      subnetwork: result.subnetwork,
      subnetBroadcast: result.subnetBroadcast,
      firstMachine: result.firstMachine,
      lastMachine: result.lastMachine,
      mainNetwork: result.mainNetwork,
      nthMachine:
        result.possibleMachines.findIndex((machine) => machine === address) + 1,
      nthUsableSubnet:
        result.possibleSubnets.findIndex(
          (subnet) => subnet === result.subnetwork
        ) + 1,
      subnetClass: result.ipClass,
      dividedNetworksCount: result.dividedNetworksCount,
      machineCountPerSubnet: result.machineCountPerSubnet,
      result: 'valid',
    };
  }

  private ipToBinary(ip: string): string {
    return ip
      .split('.')
      .map((octet) => parseInt(octet, 10).toString(2).padStart(8, '0'))
      .join('');
  }

  private binaryToIp(binary: string): string {
    return binary
      .match(/.{1,8}/g)!
      .map((b) => parseInt(b, 2).toString())
      .join('.');
  }

  private calculateNetworkInfo(ip: string, subnetMask: string) {
    const binaryIp = this.ipToBinary(ip);
    const binarySubnetMask = this.ipToBinary(subnetMask);

    // Network Address Calculation
    const networkAddressBinary = (
      BigInt('0b' + binaryIp) & BigInt('0b' + binarySubnetMask)
    )
      .toString(2)
      .padStart(32, '0');
    const subnetwork = this.binaryToIp(networkAddressBinary);

    // Broadcast Address Calculation
    const broadcastAddressBinary = (
      BigInt('0b' + networkAddressBinary) |
      (~BigInt('0b' + binarySubnetMask) & BigInt(0xffffffff))
    )
      .toString(2)
      .padStart(32, '0');
    const subnetBroadcast = this.binaryToIp(broadcastAddressBinary);

    // First and Last Machine Calculation
    const firstMachineBinary = (BigInt('0b' + networkAddressBinary) + BigInt(1))
      .toString(2)
      .padStart(32, '0');
    const lastMachineBinary = (
      BigInt('0b' + broadcastAddressBinary) - BigInt(1)
    )
      .toString(2)
      .padStart(32, '0');
    const firstMachine = this.binaryToIp(firstMachineBinary);
    const lastMachine = this.binaryToIp(lastMachineBinary);

    // Determine IP Class and Main Network (Classful)
    let ipClass = '';
    let mainNetwork = '';
    const octets = ip.split('.');
    const firstOctet = parseInt(octets[0], 10);

    if (firstOctet < 128) {
      ipClass = 'A';
      mainNetwork = `${octets[0]}.0.0.0`;
    } else if (firstOctet < 192) {
      ipClass = 'B';
      mainNetwork = `${octets[0]}.${octets[1]}.0.0`;
    } else if (firstOctet < 224) {
      ipClass = 'C';
      mainNetwork = `${octets[0]}.${octets[1]}.${octets[2]}.0`;
    } else {
      throw new Error('Invalid IP class: Cannot determine main network.');
    }

    if (mainNetwork === 'N/A') {
      throw new Error('Main network could not be determined.');
    }

    // Calculate Subnet Bits and Counts
    const subnetMaskBits = binarySubnetMask.split('1').length - 1;
    const hostBits = 32 - subnetMaskBits;
    const machineCountPerSubnet = 2 ** hostBits - 2;

    // Calculate Divided Networks Count within the classful main network
    const mainNetworkBits =
      ipClass === 'A' ? 8 : ipClass === 'B' ? 16 : ipClass === 'C' ? 24 : 0;
    const dividedNetworksCount =
      subnetMaskBits > mainNetworkBits
        ? 2 ** (subnetMaskBits - mainNetworkBits)
        : 1;

    if (dividedNetworksCount === 0 || subnetMaskBits === 0) {
      throw new Error('Invalid subnet mask or divided networks count.');
    }

    const possibleSubnets: string[] = [];
    const subnetSize = 2 ** hostBits;

    // Calculate possible subnets within main network
    for (let i = 1; i < dividedNetworksCount - 1; i++) {
      const subnetBinary = (
        BigInt('0b' + this.ipToBinary(mainNetwork)) + BigInt(i * subnetSize)
      )
        .toString(2)
        .padStart(32, '0');
      const subnetAddress = this.binaryToIp(subnetBinary);
      if (subnetAddress === 'N/A') {
        throw new Error('Invalid subnet address.');
      }
      possibleSubnets.push(subnetAddress);
    }

    // Possible Machines Calculation
    const possibleMachines: string[] = [];
    for (let i = 1n; i <= BigInt(machineCountPerSubnet); i++) {
      const machineIpBinary = (BigInt('0b' + networkAddressBinary) + i)
        .toString(2)
        .padStart(32, '0');
      const machineIp = this.binaryToIp(machineIpBinary);
      if (machineIp === 'N/A') {
        throw new Error('Invalid machine IP address.');
      }
      possibleMachines.push(machineIp);
    }

    // Determine the Result
    let result: SubnetCalculationResult;
    if (ip === subnetwork) {
      result = 'machineAddressIsSubnetAddress';
    } else if (ip === subnetBroadcast) {
      result = 'machineAddressIsBroadcastAddress';
    } else if (binarySubnetMask.endsWith('1'.repeat(hostBits))) {
      result = 'subnetBitsInNetworkAddressIsAllOnes';
    } else if (ip === mainNetwork) {
      result = 'zerothSubnet';
    } else {
      result = 'valid';
    }

    return {
      result,
      subnetwork,
      subnetBroadcast,
      firstMachine,
      lastMachine,
      mainNetwork,
      ipClass,
      dividedNetworksCount,
      machineCountPerSubnet,
      subnetMaskBits,
      possibleMachines,
      possibleSubnets,
    };
  }
}
