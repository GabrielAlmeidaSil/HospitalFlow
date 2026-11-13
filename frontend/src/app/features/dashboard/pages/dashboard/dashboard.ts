import { Component } from '@angular/core';
import { Leitos } from '../../../leitos/pages/leitos/leitos';
import { OcupacaoLeitos } from '../../components/ocupacao-leitos/ocupacao-leitos/ocupacao-leitos';
import { CardStatus } from '../../components/card-status/card-status/card-status';
import { OcorrenciasRecentes } from '../../components/ocorrencias-recentes/ocorrencias-recentes/ocorrencias-recentes';
import { StatusSetores } from '../../components/status-setores/status-setores/status-setores';

@Component({
  selector: 'app-dashboard',
  imports: [OcupacaoLeitos, CardStatus, OcorrenciasRecentes, StatusSetores],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {}
