import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileDataViewStrategyInvestmentComponent } from './mobile-data-view-strategy-investment.component';

describe('MobileDataViewStrategyInvestmentComponent', () => {
  let component: MobileDataViewStrategyInvestmentComponent;
  let fixture: ComponentFixture<MobileDataViewStrategyInvestmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileDataViewStrategyInvestmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileDataViewStrategyInvestmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
