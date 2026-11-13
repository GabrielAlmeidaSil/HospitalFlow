import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusSetores } from './status-setores';

describe('StatusSetores', () => {
  let component: StatusSetores;
  let fixture: ComponentFixture<StatusSetores>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusSetores],
    }).compileComponents();

    fixture = TestBed.createComponent(StatusSetores);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
