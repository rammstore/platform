import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileDataViewStrategyComponent } from './mobile-data-view-strategy.component';

describe('MobileDataViewStrategyComponent', () => {
  let component: MobileDataViewStrategyComponent;
  let fixture: ComponentFixture<MobileDataViewStrategyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileDataViewStrategyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileDataViewStrategyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
