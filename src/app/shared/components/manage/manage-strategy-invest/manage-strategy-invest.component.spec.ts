import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageStrategyInvestComponent } from './manage-strategy-invest.component';

describe('ManageStrategyInvestComponent', () => {
  let component: ManageStrategyInvestComponent;
  let fixture: ComponentFixture<ManageStrategyInvestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageStrategyInvestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageStrategyInvestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
