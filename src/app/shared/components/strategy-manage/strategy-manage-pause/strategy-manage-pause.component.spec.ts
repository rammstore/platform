import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyManagePauseComponent } from './strategy-manage-pause.component';

describe('StrategyManagePauseComponent', () => {
  let component: StrategyManagePauseComponent;
  let fixture: ComponentFixture<StrategyManagePauseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StrategyManagePauseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyManagePauseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
