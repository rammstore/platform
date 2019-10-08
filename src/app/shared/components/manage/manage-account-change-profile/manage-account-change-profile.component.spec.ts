import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAccountChangeProfileComponent } from './manage-account-change-profile.component';

describe('ManageAccountChangeProfileComponent', () => {
  let component: ManageAccountChangeProfileComponent;
  let fixture: ComponentFixture<ManageAccountChangeProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageAccountChangeProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAccountChangeProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
