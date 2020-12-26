import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyDetailsVideoComponent } from './strategy-details-video.component';

describe('StrategyDetailsVideoComponent', () => {
  let component: StrategyDetailsVideoComponent;
  let fixture: ComponentFixture<StrategyDetailsVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StrategyDetailsVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyDetailsVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
