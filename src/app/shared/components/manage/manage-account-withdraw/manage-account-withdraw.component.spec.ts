import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAccountWithdrawComponent } from './manage-account-withdraw.component';

describe('ManageAccountWithdrawComponent', () => {
  let component: ManageAccountWithdrawComponent;
  let fixture: ComponentFixture<ManageAccountWithdrawComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageAccountWithdrawComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAccountWithdrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
