import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyClosedComponent } from './strategy-closed.component';

describe('StrategyClosedComponent', () => {
  let component: StrategyClosedComponent;
  let fixture: ComponentFixture<StrategyClosedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StrategyClosedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyClosedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
