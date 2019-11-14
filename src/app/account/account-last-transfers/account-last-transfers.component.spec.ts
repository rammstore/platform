import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountLastTransfersComponent } from './account-last-transfers.component';

describe('AccountLastTransfersComponent', () => {
  let component: AccountLastTransfersComponent;
  let fixture: ComponentFixture<AccountLastTransfersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountLastTransfersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountLastTransfersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
