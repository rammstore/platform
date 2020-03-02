import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyDetailsInvestmentsActiveComponent } from './strategy-details-investments-active.component';

describe('StrategyDetailsInvestmentsActiveComponent', () => {
  let component: StrategyDetailsInvestmentsActiveComponent;
  let fixture: ComponentFixture<StrategyDetailsInvestmentsActiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StrategyDetailsInvestmentsActiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyDetailsInvestmentsActiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
