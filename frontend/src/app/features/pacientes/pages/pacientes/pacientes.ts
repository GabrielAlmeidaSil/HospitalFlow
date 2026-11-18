import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-pacientes',
  imports: [
    FormsModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    SelectModule,
    TableModule
  ],
  templateUrl: './pacientes.html',
  styleUrl: './pacientes.scss',
})
export class Pacientes {
  busca = signal('');
  setorSelecionado = signal<number | null>(null);
  statusSelecionado = signal<string | null>(null);
  situacaoSelecionada = signal<boolean | null>(null);

  setores = [
    { id: 1, nome: 'UTI' },
    { id: 2, nome: 'Enfermaria' },
    { id: 3, nome: 'Centro Cirúrgico' },
    { id: 4, nome: 'Pronto-Socorro' }
  ];

  statusOpcoes = [
    { nome: 'Todos os status', valor: null },
    { nome: 'Internado', valor: 'internado' },
    { nome: 'Em observação', valor: 'observacao' },
    { nome: 'Alta', valor: 'alta' }
  ];

  situacaoOpcoes = [
    { nome: 'Todos', valor: null },
    { nome: 'Ativos', valor: true },
    { nome: 'Inativos', valor: false }
  ];

  nomeStatus: any = {
    internado: 'Internado',
    observacao: 'Em observação',
    alta: 'Alta'
  };

  corStatus: any = {
    internado: 'bg-[#E0F2FE] text-[#037BD1]',
    observacao: 'bg-[#FDF5E1] text-[#CE941B]',
    alta: 'bg-[#E4F9F7] text-[#0F966E]'
  };

  pacientes = signal([
    { id: 1, nome: 'Ana Souza', cpf: '123.456.789-01', setor: { id: 1, nome: 'UTI' }, leito: 'UTI-01', status: 'internado', ativo: true },
    { id: 2, nome: 'Carlos Lima', cpf: '234.567.890-12', setor: { id: 1, nome: 'UTI' }, leito: 'UTI-02', status: 'internado', ativo: true },
    { id: 3, nome: 'Mariana Alves', cpf: '345.678.901-23', setor: { id: 2, nome: 'Enfermaria' }, leito: 'ENF-101', status: 'observacao', ativo: true },
    { id: 4, nome: 'João Pereira', cpf: '456.789.012-34', setor: { id: 2, nome: 'Enfermaria' }, leito: 'ENF-102', status: 'internado', ativo: true },
    { id: 5, nome: 'Fernanda Costa', cpf: '567.890.123-45', setor: { id: 3, nome: 'Centro Cirúrgico' }, leito: 'CC-01', status: 'internado', ativo: true },
    { id: 6, nome: 'Rafael Martins', cpf: '678.901.234-56', setor: { id: 4, nome: 'Pronto-Socorro' }, leito: 'PS-01', status: 'observacao', ativo: true },
    { id: 7, nome: 'Juliana Rocha', cpf: '789.012.345-67', setor: { id: 4, nome: 'Pronto-Socorro' }, leito: 'PS-02', status: 'observacao', ativo: true },
    { id: 8, nome: 'Pedro Santos', cpf: '890.123.456-78', setor: { id: 2, nome: 'Enfermaria' }, leito: 'ENF-103', status: 'alta', ativo: false },
    { id: 9, nome: 'Beatriz Oliveira', cpf: '901.234.567-89', setor: { id: 1, nome: 'UTI' }, leito: 'UTI-03', status: 'internado', ativo: true },
    { id: 10, nome: 'Lucas Ferreira', cpf: '012.345.678-90', setor: { id: 4, nome: 'Pronto-Socorro' }, leito: 'PS-03', status: 'alta', ativo: false }
  ]);
}
