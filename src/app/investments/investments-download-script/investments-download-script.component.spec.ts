import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentsDownloadScriptComponent } from './investments-download-script.component';

describe('InvestmentsDownloadScriptComponent', () => {
  let component: InvestmentsDownloadScriptComponent;
  let fixture: ComponentFixture<InvestmentsDownloadScriptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestmentsDownloadScriptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestmentsDownloadScriptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
