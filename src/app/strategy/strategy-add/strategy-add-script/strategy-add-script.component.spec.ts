import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyAddScriptComponent } from './strategy-add-script.component';

describe('StrategyAddScriptComponent', () => {
  let component: StrategyAddScriptComponent;
  let fixture: ComponentFixture<StrategyAddScriptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StrategyAddScriptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyAddScriptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
