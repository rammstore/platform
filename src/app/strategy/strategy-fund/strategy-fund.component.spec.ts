import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyFundComponent } from './strategy-fund.component';

describe('StrategyFundComponent', () => {
  let component: StrategyFundComponent;
  let fixture: ComponentFixture<StrategyFundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StrategyFundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyFundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
