import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OcorrenciasRecentes } from './ocorrencias-recentes';

describe('OcorrenciasRecentes', () => {
  let component: OcorrenciasRecentes;
  let fixture: ComponentFixture<OcorrenciasRecentes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OcorrenciasRecentes],
    }).compileComponents();

    fixture = TestBed.createComponent(OcorrenciasRecentes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
