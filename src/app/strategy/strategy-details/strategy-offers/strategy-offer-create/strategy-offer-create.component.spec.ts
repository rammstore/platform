import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyOfferCreateComponent } from './strategy-offer-create.component';

describe('StrategyOfferCreateComponent', () => {
  let component: StrategyOfferCreateComponent;
  let fixture: ComponentFixture<StrategyOfferCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StrategyOfferCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyOfferCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
