import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileDataViewLastTransfersComponent } from './mobile-data-view-last-transfers.component';

describe('MobileDataViewLastTransfersComponent', () => {
  let component: MobileDataViewLastTransfersComponent;
  let fixture: ComponentFixture<MobileDataViewLastTransfersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileDataViewLastTransfersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileDataViewLastTransfersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
