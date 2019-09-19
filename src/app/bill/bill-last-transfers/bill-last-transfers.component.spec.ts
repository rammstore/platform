import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillLastTransfersComponent } from './bill-last-transfers.component';

describe('BillLastTransfersComponent', () => {
  let component: BillLastTransfersComponent;
  let fixture: ComponentFixture<BillLastTransfersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillLastTransfersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillLastTransfersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
