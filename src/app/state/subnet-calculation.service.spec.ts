/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SubnetCalculationService } from './subnet-calculation.service';

describe('Service: SubnetCalculation', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SubnetCalculationService],
    });
  });

  it('should ...', inject(
    [SubnetCalculationService],
    (service: SubnetCalculationService) => {
      expect(service).toBeTruthy();
    }
  ));

  it('should have initial form value', inject(
    [SubnetCalculationService],
    (service: SubnetCalculationService) => {
      const initialFormValue = service.getInitialFormValue();
      expect(initialFormValue).toBeDefined();
    }
  ));

  it('should calculate network info correctly', inject(
    [SubnetCalculationService],
    (service: SubnetCalculationService) => {
      const result = (service as any).calculateNetworkInfo(
        '192.168.1.1',
        '255.255.255.0'
      );

      expect(result.subnetwork).toBe('192.168.1.0');
      expect(result.subnetBroadcast).toBe('192.168.1.255');
      expect(result.firstMachine).toBe('192.168.1.1');
      expect(result.lastMachine).toBe('192.168.1.254');
      expect(result.mainNetwork).toBe('192.168.1.0');
      expect(result.ipClass).toBe('C');
      expect(result.machineCountPerSubnet).toBe(254);
      expect(result.dividedNetworksCount).toBe(1);
      expect(result.result).toBe('valid');

      const result2 = (service as any).calculateNetworkInfo(
        '168.135.63.169',
        '255.255.255.252'
      );

      expect(result2.subnetwork).toBe('168.135.63.168');
      expect(result2.subnetBroadcast).toBe('168.135.63.171');
      expect(result2.firstMachine).toBe('168.135.63.169');
      expect(result2.lastMachine).toBe('168.135.63.170');
      expect(result2.mainNetwork).toBe('168.135.0.0');
      expect(result2.ipClass).toBe('B');
      expect(result2.machineCountPerSubnet).toBe(2);
      expect(result2.dividedNetworksCount).toBe(16384);
      expect(result2.result).toBe('valid');
    }
  ));

  it('should convert IP to binary correctly', inject(
    [SubnetCalculationService],
    (service: SubnetCalculationService) => {
      const ip = '192.168.1.1';
      const binary = (service as any).ipToBinary(ip);
      expect(binary).toBe('11000000101010000000000100000001');
    }
  ));

  it('should convert binary to IP correctly', inject(
    [SubnetCalculationService],
    (service: SubnetCalculationService) => {
      const binary = '11000000101010000000000100000001';
      const ip = (service as any).binaryToIp(binary);
      expect(ip).toBe('192.168.1.1');
    }
  ));

  it('should generate random number within range', inject(
    [SubnetCalculationService],
    (service: SubnetCalculationService) => {
      const min = 1;
      const max = 10;
      const randomNumber = (service as any).getRandomNumber(min, max);
      expect(randomNumber).toBeGreaterThanOrEqual(min);
      expect(randomNumber).toBeLessThanOrEqual(max);
    }
  ));

  it('should generate random address with subnet mask', inject(
    [SubnetCalculationService],
    (service: SubnetCalculationService) => {
      const { address, subnetMask } = (
        service as any
      ).getRandomAddressWithSubnetMask();
      expect(address).toMatch(/^(\d{1,3}\.){3}\d{1,3}$/);
      expect(subnetMask).toMatch(/^(\d{1,3}\.){3}\d{1,3}$/);
    }
  ));
});
