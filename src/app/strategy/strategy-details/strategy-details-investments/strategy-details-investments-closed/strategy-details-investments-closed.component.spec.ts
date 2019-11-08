import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyDetailsInvestmentsClosedComponent } from './strategy-details-investments-closed.component';

describe('StrategyDetailsInvestmentsClosedComponent', () => {
  let component: StrategyDetailsInvestmentsClosedComponent;
  let fixture: ComponentFixture<StrategyDetailsInvestmentsClosedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StrategyDetailsInvestmentsClosedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyDetailsInvestmentsClosedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
