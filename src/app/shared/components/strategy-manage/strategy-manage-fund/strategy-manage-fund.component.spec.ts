import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyManageFundComponent } from './strategy-manage-fund.component';

describe('StrategyManageFundComponent', () => {
  let component: StrategyManageFundComponent;
  let fixture: ComponentFixture<StrategyManageFundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StrategyManageFundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyManageFundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
