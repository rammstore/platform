import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileDataViewStrategiesClosedComponent } from './mobile-data-view-strategies-closed.component';

describe('MobileDataViewStrategiesClosedComponent', () => {
  let component: MobileDataViewStrategiesClosedComponent;
  let fixture: ComponentFixture<MobileDataViewStrategiesClosedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileDataViewStrategiesClosedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileDataViewStrategiesClosedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
