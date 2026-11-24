import { Component, input } from '@angular/core';
import { ProgressBarModule } from 'primeng/progressbar';
import { OcupacaoSetorResponse } from '../../../models/dashboard.model';

@Component({
  selector: 'app-ocupacao-leitos',
  imports: [ProgressBarModule],
  templateUrl: './ocupacao-leitos.html',
  styleUrl: './ocupacao-leitos.scss',
})
export class OcupacaoLeitos {

  ocupacaoSetores = input.required<OcupacaoSetorResponse[]>();

}
