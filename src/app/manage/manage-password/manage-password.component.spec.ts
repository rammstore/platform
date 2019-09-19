import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePasswordComponent } from './manage-password.component';

describe('ManagePasswordComponent', () => {
  let component: ManagePasswordComponent;
  let fixture: ComponentFixture<ManagePasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagePasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
