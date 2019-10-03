import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyManageChangeInvestmentWithdrawComponent } from './strategy-manage-change-investment-withdraw.component';

describe('StrategyManageChangeInvestmentWithdrawComponent', () => {
  let component: StrategyManageChangeInvestmentWithdrawComponent;
  let fixture: ComponentFixture<StrategyManageChangeInvestmentWithdrawComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StrategyManageChangeInvestmentWithdrawComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyManageChangeInvestmentWithdrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
