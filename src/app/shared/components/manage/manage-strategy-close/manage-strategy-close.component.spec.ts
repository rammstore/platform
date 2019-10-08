import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageStrategyCloseComponent } from './manage-strategy-close.component';

describe('ManageStrategyCloseComponent', () => {
  let component: ManageStrategyCloseComponent;
  let fixture: ComponentFixture<ManageStrategyCloseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageStrategyCloseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageStrategyCloseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
