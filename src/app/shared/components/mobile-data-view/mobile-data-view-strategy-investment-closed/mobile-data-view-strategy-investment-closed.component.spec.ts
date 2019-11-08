import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileDataViewStrategyInvestmentClosedComponent } from './mobile-data-view-strategy-investment-closed.component';

describe('MobileDataViewStrategyInvestmentClosedComponent', () => {
  let component: MobileDataViewStrategyInvestmentClosedComponent;
  let fixture: ComponentFixture<MobileDataViewStrategyInvestmentClosedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileDataViewStrategyInvestmentClosedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileDataViewStrategyInvestmentClosedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
