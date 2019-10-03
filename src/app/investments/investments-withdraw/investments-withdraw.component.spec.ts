import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentsWithdrawComponent } from './investments-withdraw.component';

describe('InvestmentsWithdrawComponent', () => {
  let component: InvestmentsWithdrawComponent;
  let fixture: ComponentFixture<InvestmentsWithdrawComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestmentsWithdrawComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestmentsWithdrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
