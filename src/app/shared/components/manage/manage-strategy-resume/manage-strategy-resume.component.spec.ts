import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageStrategyResumeComponent } from './manage-strategy-resume.component';

describe('ManageStrategyResumeComponent', () => {
  let component: ManageStrategyResumeComponent;
  let fixture: ComponentFixture<ManageStrategyResumeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageStrategyResumeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageStrategyResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
