import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyDetailsProfitabilityComponent } from './strategy-details-profitability.component';

describe('StrategyDetailsProfitabilityComponent', () => {
  let component: StrategyDetailsProfitabilityComponent;
  let fixture: ComponentFixture<StrategyDetailsProfitabilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StrategyDetailsProfitabilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyDetailsProfitabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
