import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAccountResumeComponent } from './manage-account-resume.component';

describe('ManageAccountResumeComponent', () => {
  let component: ManageAccountResumeComponent;
  let fixture: ComponentFixture<ManageAccountResumeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageAccountResumeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAccountResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
