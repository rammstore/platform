import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyLinkComponent } from './strategy-link.component';

describe('StrategyLinkComponent', () => {
  let component: StrategyLinkComponent;
  let fixture: ComponentFixture<StrategyLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StrategyLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
