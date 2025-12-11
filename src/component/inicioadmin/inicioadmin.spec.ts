import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Inicioadmin } from './inicioadmin';

describe('Inicioadmin', () => {
  let component: Inicioadmin;
  let fixture: ComponentFixture<Inicioadmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Inicioadmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Inicioadmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
