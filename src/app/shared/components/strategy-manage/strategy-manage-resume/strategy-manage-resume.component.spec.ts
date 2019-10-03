import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyManageResumeComponent } from './strategy-manage-resume.component';

describe('StrategyManageResumeComponent', () => {
  let component: StrategyManageResumeComponent;
  let fixture: ComponentFixture<StrategyManageResumeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StrategyManageResumeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyManageResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
