import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubnetCalculationComponent } from './subnet-calculation.component';

describe('SubnetCalculationComponent', () => {
  let component: SubnetCalculationComponent;
  let fixture: ComponentFixture<SubnetCalculationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubnetCalculationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubnetCalculationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
