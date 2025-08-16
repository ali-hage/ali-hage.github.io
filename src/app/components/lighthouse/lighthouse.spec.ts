import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lighthouse } from './lighthouse';

describe('Lighthouse', () => {
  let component: Lighthouse;
  let fixture: ComponentFixture<Lighthouse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Lighthouse]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Lighthouse);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
