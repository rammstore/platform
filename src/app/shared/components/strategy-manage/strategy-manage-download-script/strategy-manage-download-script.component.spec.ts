import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyManageDownloadScriptComponent } from './strategy-manage-download-script.component';

describe('StrategyManageDownloadScriptComponent', () => {
  let component: StrategyManageDownloadScriptComponent;
  let fixture: ComponentFixture<StrategyManageDownloadScriptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StrategyManageDownloadScriptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyManageDownloadScriptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
