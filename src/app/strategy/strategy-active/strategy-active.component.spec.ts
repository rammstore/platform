import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyActiveComponent } from './strategy-active.component';

describe('StrategyActiveComponent', () => {
  let component: StrategyActiveComponent;
  let fixture: ComponentFixture<StrategyActiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StrategyActiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyActiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
