import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillWithdrawComponent } from './bill-withdraw.component';

describe('BillWithdrawComponent', () => {
  let component: BillWithdrawComponent;
  let fixture: ComponentFixture<BillWithdrawComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillWithdrawComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillWithdrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
