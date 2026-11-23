import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-atendimentos',
  imports: [
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    SelectModule,
    TableModule
  ],
  templateUrl: './atendimentos.html',
  styleUrl: './atendimentos.scss',
})
export class Atendimentos {

  statusOpcoes = [
    { nome: 'Todos os status', valor: null },
    { nome: 'Em atendimento', valor: 'Em atendimento' },
    { nome: 'Observação', valor: 'Observação' },
    { nome: 'Internado', valor: 'Internado' },
    { nome: 'Alta', valor: 'Alta' }
  ];

  setorOpcoes = [
    { nome: 'Todos os setores', valor: null },
    { nome: 'Pronto-Socorro', valor: 'Pronto-Socorro' },
    { nome: 'Emergência', valor: 'Emergência' },
    { nome: 'Clínica Médica', valor: 'Clínica Médica' },
    { nome: 'UTI', valor: 'UTI' },
    { nome: 'Clínica Cirúrgica', valor: 'Clínica Cirúrgica' },
    { nome: 'Ortopedia', valor: 'Ortopedia' }
  ];

  situacaoOpcoes = [
    { nome: 'Todos', valor: null },
    { nome: 'Em aberto', valor: 'Em aberto' },
    { nome: 'Encerrado', valor: 'Encerrado' }
  ];

  atendimentos = [
    { paciente: 'Ana Silva Pereira', cpf: '123.456.789-00', status: 'Em atendimento', setor: 'Pronto-Socorro', leito: '--', data_entrada: '24/01/2025 10:24', data_saida: '--', situacao: 'Em aberto' },
    { paciente: 'Carlos Mendes', cpf: '987.654.321-00', status: 'Observação', setor: 'Emergência', leito: '--', data_entrada: '24/01/2025 08:15', data_saida: '--', situacao: 'Em aberto' },
    { paciente: 'Maria Oliveira Costa', cpf: '456.789.123-00', status: 'Internado', setor: 'Clínica Médica', leito: '402-A', data_entrada: '20/01/2025 14:30', data_saida: '--', situacao: 'Em aberto' },
    { paciente: 'João Souza Lima', cpf: '321.654.987-00', status: 'Internado', setor: 'UTI', leito: 'UTI-03', data_entrada: '19/01/2025 22:10', data_saida: '--', situacao: 'Em aberto' },
    { paciente: 'Fernanda Rodrigues', cpf: '741.852.963-00', status: 'Alta', setor: 'Clínica Cirúrgica', leito: '301-B', data_entrada: '15/01/2025 09:00', data_saida: '18/01/2025 16:40', situacao: 'Encerrado' },
    { paciente: 'Rafael Almeida', cpf: '963.852.741-00', status: 'Alta', setor: 'Ortopedia', leito: '205-A', data_entrada: '10/01/2025 11:20', data_saida: '13/01/2025 10:15', situacao: 'Encerrado' },
    { paciente: 'Juliana Carvalho', cpf: '159.753.486-00', status: 'Alta', setor: 'Clínica Médica', leito: '303-B', data_entrada: '05/01/2025 17:40', data_saida: '08/01/2025 09:30', situacao: 'Encerrado' },
    { paciente: 'Paulo Henrique Dias', cpf: '753.951.852-00', status: 'Em atendimento', setor: 'Pronto-Socorro', leito: '--', data_entrada: '24/01/2025 12:05', data_saida: '--', situacao: 'Em aberto' }
  ];
}
