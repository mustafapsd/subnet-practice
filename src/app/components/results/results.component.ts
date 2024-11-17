import { Component } from '@angular/core';
import { SubnetCalculationService } from '../../state/subnet-calculation.service';
import { ResultToSentencePipe } from './result-to-sentence.pipe';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [ResultToSentencePipe],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss',
})
export class ResultsComponent {
  showResults = false;

  constructor(public subnetCalculationService: SubnetCalculationService) {}

  toggleResults(): void {
    this.showResults = !this.showResults;
  }
}
