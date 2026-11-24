import { Component, inject, OnInit, signal } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { ResumoDashboardResponse } from '../../models/dashboard.model';
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
export class Dashboard implements OnInit {

  private dashboardService = inject(DashboardService)

  resumo = signal<ResumoDashboardResponse>({
    leitos_total: 0,
    leitos_ocupados: 0,
    leitos_disponiveis: 0,
    porcentagem_ocupacao: 0,
    pacientes_em_atendimento: 0,
    altas_hoje: 0
  })

  ngOnInit(): void {
    this.carregarResumo()
  }

  carregarResumo() {
    this.dashboardService.resumo().subscribe({
      next: (resumo_dashboard) => {
        this.resumo.set(resumo_dashboard)
      },

      error: (erro) => {
        console.error('Erro ao carregar o Dashboard: ', erro)
      }
    })
  }

}
