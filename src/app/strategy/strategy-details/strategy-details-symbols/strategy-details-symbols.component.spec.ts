import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyDetailsSymbolsComponent } from './strategy-details-symbols.component';

describe('StrategyDetailsSymbolsComponent', () => {
  let component: StrategyDetailsSymbolsComponent;
  let fixture: ComponentFixture<StrategyDetailsSymbolsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StrategyDetailsSymbolsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyDetailsSymbolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
