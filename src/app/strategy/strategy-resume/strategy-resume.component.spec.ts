import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyResumeComponent } from './strategy-resume.component';

describe('StrategyResumeComponent', () => {
  let component: StrategyResumeComponent;
  let fixture: ComponentFixture<StrategyResumeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StrategyResumeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
