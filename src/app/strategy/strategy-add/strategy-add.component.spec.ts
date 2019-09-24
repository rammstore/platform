import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyAddComponent } from './strategy-add.component';

describe('StrategyAddComponent', () => {
  let component: StrategyAddComponent;
  let fixture: ComponentFixture<StrategyAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StrategyAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
