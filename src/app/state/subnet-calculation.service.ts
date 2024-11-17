import { Injectable } from '@angular/core';
import {
  SubnetCalculationFormValue,
  SubnetCalculationResult,
} from '../models/subnet-calculation-form';
import { SubnetCalculationInitialCombinations } from '../models/subnet-calculation-start';

@Injectable({
  providedIn: 'root',
})
export class SubnetCalculationService {
  subnetFinalResult!: SubnetCalculationFormValue;

  constructor() {}

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
      subnetMaskBits: this.getRandomNumber(1, 30),
    };
  }

  private calculateResult() {
    let result;
    let address;
    let subnetMaskBits;

    while (true) {
      try {
        const randomAddresses = this.getRandomAddressWithSubnetMask();
        address = randomAddresses.address;
        subnetMaskBits = randomAddresses.subnetMaskBits;
        result = this.calculateNetworkInfo(address, subnetMaskBits);
        break; // Exit the loop if no error is thrown
      } catch (error) {
        // Optionally log the error or handle it
        console.error('Error calculating network info:', error);
      }
    }

    this.subnetFinalResult = {
      address,
      subnetMask: result.subnetMask,
      subnetMaskBits: result.subnetMaskBits,
      subnetwork: result.subnetwork,
      subnetBroadcast: result.subnetBroadcast,
      firstMachine: result.firstMachine,
      lastMachine: result.lastMachine,
      mainNetwork: result.mainNetwork,
      nthMachine: result.nMachine,
      nthUsableSubnet: result.nSubnet,
      subnetClass: result.ipClass,
      dividedNetworksCount: result.dividedNetworksCount,
      machineCountPerSubnet: result.machineCountPerSubnet,
      result: result.result,
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

  private calculateNetworkInfo(ip: string, subnetMaskBits: number) {
    const binaryIp = this.ipToBinary(ip);
    const binarySubnetMask = '1'.repeat(subnetMaskBits).padEnd(32, '0');
    const subnetMask = this.binaryToIp(binarySubnetMask);

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
    const hostBits = 32 - subnetMaskBits;
    const machineCountPerSubnet = 2 ** hostBits - 2;

    // Calculate Divided Networks Count within the classful main network
    const mainNetworkBits =
      ipClass === 'A' ? 8 : ipClass === 'B' ? 16 : ipClass === 'C' ? 24 : 0;
    const subnetBits = subnetMaskBits - mainNetworkBits;
    const dividedNetworksCount = subnetBits > 0 ? 2 ** subnetBits : 1;

    if (dividedNetworksCount === 0 || subnetMaskBits === 0) {
      throw new Error('Invalid subnet mask or divided networks count.');
    }

    const subnetSize = 2 ** hostBits;

    // Calculate nth Subnet within main network
    const mainNetworkBinary = this.ipToBinary(mainNetwork);
    const subnetOffset =
      BigInt('0b' + networkAddressBinary) - BigInt('0b' + mainNetworkBinary);
    const nSubnet = Number(subnetOffset / BigInt(subnetSize));

    // Calculate nth Machine IP within current subnet
    const machineOffset =
      BigInt('0b' + binaryIp) - BigInt('0b' + networkAddressBinary);
    const nMachine = Number(machineOffset - BigInt(1)) + 1; // Adjusting for the first usable IP

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
      subnetMask,
      subnetwork,
      subnetBroadcast,
      firstMachine,
      lastMachine,
      mainNetwork,
      ipClass,
      dividedNetworksCount,
      machineCountPerSubnet,
      subnetMaskBits,
      nSubnet,
      nMachine,
    };
  }
}
