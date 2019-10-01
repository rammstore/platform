import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyDetailsInvestmentsComponent } from './strategy-details-investments.component';

describe('StrategyDetailsInvestmentsComponent', () => {
  let component: StrategyDetailsInvestmentsComponent;
  let fixture: ComponentFixture<StrategyDetailsInvestmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StrategyDetailsInvestmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyDetailsInvestmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
