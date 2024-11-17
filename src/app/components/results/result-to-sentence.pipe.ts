import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'resultToSentence',
  standalone: true,
})
export class ResultToSentencePipe implements PipeTransform {
  transform(
    value:
      | 'valid'
      | 'machineAddressIsSubnetAddress'
      | 'machineAddressIsBroadcastAddress'
      | 'subnetBitsInNetworkAddressIsAllOnes'
      | 'zerothSubnet'
  ): string | null {
    switch (value) {
      case 'valid':
        return 'Valid combination';
      case 'machineAddressIsSubnetAddress':
        return 'The machine address is the same as the subnet address.';
      case 'machineAddressIsBroadcastAddress':
        return 'The machine address is the same as the broadcast address.';
      case 'subnetBitsInNetworkAddressIsAllOnes':
        return 'The subnet bits in the network address are all ones.';
      case 'zerothSubnet':
        return 'The subnet is the zeroth subnet.';
      default:
        return null;
    }
  }
}
