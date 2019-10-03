import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyManageChangeInvestmentProfileComponent } from './strategy-manage-change-investment-profile.component';

describe('StrategyManageChangeInvestmentProfileComponent', () => {
  let component: StrategyManageChangeInvestmentProfileComponent;
  let fixture: ComponentFixture<StrategyManageChangeInvestmentProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StrategyManageChangeInvestmentProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyManageChangeInvestmentProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
