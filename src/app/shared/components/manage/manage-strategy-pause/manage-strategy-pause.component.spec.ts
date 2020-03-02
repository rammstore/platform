import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageStrategyPauseComponent } from './manage-strategy-pause.component';

describe('ManageStrategyPauseComponent', () => {
  let component: ManageStrategyPauseComponent;
  let fixture: ComponentFixture<ManageStrategyPauseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageStrategyPauseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageStrategyPauseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
