import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyManageComponent } from './strategy-manage.component';

describe('StrategyManageComponent', () => {
  let component: StrategyManageComponent;
  let fixture: ComponentFixture<StrategyManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StrategyManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
