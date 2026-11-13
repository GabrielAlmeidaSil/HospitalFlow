import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';

interface Periodo {
    nome: string;
    valor: string;
}

@Component({
  selector: 'app-ocupacao-leitos',
  imports: [ChartModule, SelectModule, FormsModule],
  templateUrl: './ocupacao-leitos.html',
  styleUrl: './ocupacao-leitos.scss',
})
export class OcupacaoLeitos implements OnInit {
    data: any;
    options: any;
    periodos: Periodo[] = [];
    periodoSelecionado: Periodo | undefined;

    ngOnInit() {
        this.initChart();

        this.periodos = [
            { nome: 'Últimas 24 horas', valor: '24h' },
            { nome: 'Últimos 7 dias', valor: '7d' },
            { nome: 'Últimos 30 dias', valor: '30d' }
        ];

        this.periodoSelecionado = this.periodos[0];
    }

    initChart() {
    this.data = {
      labels: ['12h', '16h', '20h', '00h', '04h', '08h'],
      datasets: [
        {
          label: 'Ocupação (%)',
          data: [75, 77, 80, 82, 79, 82],
          fill: true,
          borderColor: '#14B8A6',
          backgroundColor: 'rgba(20, 184, 166, 0.15)',
          tension: 0.4
        }
      ]
    };

    this.options = {
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          ticks: { color: '#6B7280' },
          grid: { display: false }
        },
        y: {
          min: 60,
          max: 100,
          ticks: {
            color: '#6B7280',
            callback: (valor: number) => valor + '%'
          },
          grid: { color: '#E5E7EB' }
        }
      }
    };
  }
}
