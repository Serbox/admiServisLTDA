import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServisOneforOne } from './servis-onefor-one';

describe('ServisOneforOne', () => {
  let component: ServisOneforOne;
  let fixture: ComponentFixture<ServisOneforOne>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServisOneforOne]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServisOneforOne);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
