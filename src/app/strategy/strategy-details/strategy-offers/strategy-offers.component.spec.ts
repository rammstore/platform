import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyOffersComponent } from './strategy-offers.component';

describe('StrategyOffersComponent', () => {
  let component: StrategyOffersComponent;
  let fixture: ComponentFixture<StrategyOffersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StrategyOffersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
