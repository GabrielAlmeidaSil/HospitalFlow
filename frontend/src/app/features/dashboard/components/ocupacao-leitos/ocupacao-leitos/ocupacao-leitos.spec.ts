import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OcupacaoLeitos } from './ocupacao-leitos';

describe('OcupacaoLeitos', () => {
  let component: OcupacaoLeitos;
  let fixture: ComponentFixture<OcupacaoLeitos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OcupacaoLeitos],
    }).compileComponents();

    fixture = TestBed.createComponent(OcupacaoLeitos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
