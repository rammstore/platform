import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyManageCloseComponent } from './strategy-manage-close.component';

describe('StrategyManageCloseComponent', () => {
  let component: StrategyManageCloseComponent;
  let fixture: ComponentFixture<StrategyManageCloseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StrategyManageCloseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyManageCloseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
