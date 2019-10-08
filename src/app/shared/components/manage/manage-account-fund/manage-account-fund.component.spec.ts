import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAccountFundComponent } from './manage-account-fund.component';

describe('ManageAccountFundComponent', () => {
  let component: ManageAccountFundComponent;
  let fixture: ComponentFixture<ManageAccountFundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageAccountFundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAccountFundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
