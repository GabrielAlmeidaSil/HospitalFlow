import { Component, inject, signal, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { OcorrenciasService } from '../../services/ocorrencias.service';
import { ResumoOcorrenciasResponse } from '../../models/ocorrencias.models';
import { StatusPrioridade } from '../../models/ocorrencias.models';
import { StatusOcorrencia } from '../../models/ocorrencias.models';

@Component({
  selector: 'app-ocorrencias',
  imports: [
    FormsModule,
    DatePipe,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    SelectModule,
    TableModule
  ],
  templateUrl: './ocorrencias.html',
  styleUrl: './ocorrencias.scss',
})
export class Ocorrencias implements OnInit {

  ocorrenciaService = inject(OcorrenciasService)

  resumoOcorrencia = signal<ResumoOcorrenciasResponse>({
    abertas: 0,
    em_resolucao: 0,
    criticas_pendentes: 0,
    resolvidas_hoje: 0
  })

  //FILTROS
  busca = signal('')
  setorSelecionado = signal<number | null>(null)
  prioridadeSelecionada = signal<StatusPrioridade | null>(null)
  statusSelecionado = signal<StatusOcorrencia | null>(null)

  setorOpcoes = [
    { nome: 'UTI', valor: 1 },
    { nome: 'Enfermaria', valor: 2 },
    { nome: 'Centro Cirúrgico', valor: 3 },
    { nome: 'Pronto-Socorro', valor: 4 }
  ]

  prioridadeOpcoes = [
    { nome: 'Todas', valor: null },
    { nome: 'Baixa', valor: 'baixa' },
    { nome: 'Média', valor: 'media' },
    { nome: 'Alta', valor: 'alta' },
    { nome: 'Crítica', valor: 'critica' }
  ]

  statusOpcoes = [
    { nome: 'Todos', valor: null },
    { nome: 'Aberta', valor: 'aberta' },
    { nome: 'Em resolução', valor: 'em_resolucao' },
    { nome: 'Resolvida', valor: 'resolvida' }
  ]

  ocorrencias = [
    {
      id: 1,
      titulo: 'Falha no monitor multiparâmetro',
      setor: 'UTI',
      prioridade: 'critica',
      status: 'aberta',
      responsavel: null,
      data_abertura: '2026-01-26T08:10:00'
    },
    {
      id: 2,
      titulo: 'Leito sem higienização',
      setor: 'Enfermaria',
      prioridade: 'alta',
      status: 'em_resolucao',
      responsavel: 'Carlos Lima',
      data_abertura: '2026-01-26T08:42:00'
    },
    {
      id: 3,
      titulo: 'Ar-condicionado inoperante',
      setor: 'Centro Cirúrgico',
      prioridade: 'media',
      status: 'resolvida',
      responsavel: 'Marina Souza',
      data_abertura: '2026-01-26T07:55:00'
    },
    {
      id: 4,
      titulo: 'Medicamento não localizado',
      setor: 'Pronto-Socorro',
      prioridade: 'media',
      status: 'aberta',
      responsavel: null,
      data_abertura: '2026-01-26T09:05:00'
    },
    {
      id: 5,
      titulo: 'Bomba de infusão com erro',
      setor: 'UTI',
      prioridade: 'critica',
      status: 'em_resolucao',
      responsavel: 'Fernanda Costa',
      data_abertura: '2026-01-26T09:18:00'
    }
  ]

  ngOnInit(): void {
    this.carregarResumo()
  }

  carregarResumo() {
    this.ocorrenciaService.resumo().subscribe({
       next: (ocorrencias) => {
        this.resumoOcorrencia.set(ocorrencias)
       },

       error: (erro) => {
        console.error("Erro ao carregar resumo de ocorrencias: ", erro)
       }
    })
  }

}
