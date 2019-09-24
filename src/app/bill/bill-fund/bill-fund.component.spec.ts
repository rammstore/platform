import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillFundComponent } from './bill-fund.component';

describe('BillFundComponent', () => {
  let component: BillFundComponent;
  let fixture: ComponentFixture<BillFundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillFundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillFundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
