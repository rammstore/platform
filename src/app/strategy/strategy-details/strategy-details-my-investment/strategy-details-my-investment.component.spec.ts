import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyDetailsMyInvestmentComponent } from './strategy-details-my-investment.component';

describe('StrategyDetailsMyInvestmentComponent', () => {
  let component: StrategyDetailsMyInvestmentComponent;
  let fixture: ComponentFixture<StrategyDetailsMyInvestmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StrategyDetailsMyInvestmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyDetailsMyInvestmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
