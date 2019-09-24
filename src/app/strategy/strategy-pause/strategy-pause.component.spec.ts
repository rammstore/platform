import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyPauseComponent } from './strategy-pause.component';

describe('StrategyPauseComponent', () => {
  let component: StrategyPauseComponent;
  let fixture: ComponentFixture<StrategyPauseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StrategyPauseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyPauseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
