import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageStrategyDownloadScriptComponent } from './manage-strategy-download-script.component';

describe('ManageStrategyDownloadScriptComponent', () => {
  let component: ManageStrategyDownloadScriptComponent;
  let fixture: ComponentFixture<ManageStrategyDownloadScriptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageStrategyDownloadScriptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageStrategyDownloadScriptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
