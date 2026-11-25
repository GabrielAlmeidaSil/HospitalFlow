import { Component, input } from '@angular/core';
import { AtendimentosRecentesResponse } from '../../../models/dashboard.model';
import { StatusAtendimentosRecentes } from '../../../models/dashboard.model';

@Component({
  selector: 'app-ocorrencias-recentes',
  templateUrl: './ocorrencias-recentes.html',
  styleUrl: './ocorrencias-recentes.scss',
})
export class OcorrenciasRecentes {

  atendimentosRecentes = input.required<AtendimentosRecentesResponse[]>()


  tempoDeEntrada(data: string): string {
    const entrada = new Date(data).getTime()
    const agora = Date.now();

    const minutos = Math.max(
      0,
      Math.floor((agora - entrada) / 60000)
    )

    if (!Number.isFinite(minutos)) {
      return '-';
    }

    if (minutos < 1) {
      return 'Agora';
    }

    if (minutos < 60) {
      return `Há ${minutos} min`;
    }


    const horas = Math.floor(minutos / 60);

    if (horas < 24) {
      return `há ${horas} h`
    }

    const dias = Math.floor(horas / 24);

    return `há ${dias} ${dias === 1 ? 'dia': 'dias'}`
  }


  corStatus(status: StatusAtendimentosRecentes): string {
    
    switch(status) {
      case 'em_atendimento':
        return '#046096';

      case 'observacao':
        return '#E59930';

      case 'internado':
        return '#5201BF';

      case 'alta':
        return '#3AAA8A'
    }
  }


  backgroundStatus(status: StatusAtendimentosRecentes): string {

    switch(status) {
      case 'em_atendimento':
        return 'bg-[#E5F4FD] text-[#046096]'

      case 'observacao':
        return 'bg-[#FEF2DC] text-[#E59930]'

      case 'internado':
        return 'bg-[#F5EFFE] text-[#5201BF]'

      case 'alta':
        return 'bg-[#E7F7EF] text-[#3AAA8A]'
    }

  }

}
