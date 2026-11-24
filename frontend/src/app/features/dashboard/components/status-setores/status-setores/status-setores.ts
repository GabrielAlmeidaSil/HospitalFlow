import { Component, input } from '@angular/core';
import { ProgressBarModule } from 'primeng/progressbar';
import { DistribuicaoAtendimentosResponse, StatusDistribuicaoAtendimento } from '../../../models/dashboard.model';

@Component({
  selector: 'app-status-setores',
  imports: [ProgressBarModule],
  templateUrl: './status-setores.html',
  styleUrl: './status-setores.scss',
})
export class StatusSetores {

  distribuicao = input.required<DistribuicaoAtendimentosResponse[]>();

  nomeStatus(status: StatusDistribuicaoAtendimento): string {
    switch (status) {
      case 'em_atendimento':
        return 'Em atendimento';
      
      case 'observacao':
        return 'Observação';

      case 'internado':
        return 'Internados';
    }
  }

  corStatus(status: StatusDistribuicaoAtendimento): string {
    switch(status) {
      case 'em_atendimento':
        return '#046096';

      case 'observacao':
        return '#E59930';

      case 'internado':
        return '#5201BF'
    }
  }

  classePercentual(
    status: StatusDistribuicaoAtendimento
  ): string {
    switch (status) {
      case 'em_atendimento':
        return 'bg-[#E5F4FD] text-[#046096]';

      case 'observacao':
        return 'bg-[#FEF2DC] text-[#E59930]';

      case 'internado':
        return 'bg-[#F5EFFE] text-[#5201BF]';

    }
  }

}
