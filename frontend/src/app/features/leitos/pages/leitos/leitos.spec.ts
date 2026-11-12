import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Leitos } from './leitos';

describe('Leitos', () => {
  let component: Leitos;
  let fixture: ComponentFixture<Leitos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Leitos],
    }).compileComponents();

    fixture = TestBed.createComponent(Leitos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
