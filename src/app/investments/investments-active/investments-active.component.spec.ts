import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentsActiveComponent } from './investments-active.component';

describe('InvestmentsActiveComponent', () => {
  let component: InvestmentsActiveComponent;
  let fixture: ComponentFixture<InvestmentsActiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestmentsActiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestmentsActiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
