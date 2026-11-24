import { Component, input } from '@angular/core';
import { ResumoDashboardResponse } from '../../../models/dashboard.model';

@Component({
  selector: 'app-card-status',
  imports: [],
  templateUrl: './card-status.html',
  styleUrl: './card-status.scss',
})
export class CardStatus {

  resumo = input.required<ResumoDashboardResponse>();
}
