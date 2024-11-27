import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-success-alert',
  standalone: true,
  imports: [],
  templateUrl: './success-alert.component.html',
  styleUrl: './success-alert.component.scss',
})
export class SuccessAlertComponent {
  @Input() showAlert = false;
  @Output() showAlertChange = new EventEmitter<boolean>();

  @Output() newQuestionRequested = new EventEmitter<void>();

  closeAlert(): void {
    this.showAlertChange.emit(false);
  }
}
