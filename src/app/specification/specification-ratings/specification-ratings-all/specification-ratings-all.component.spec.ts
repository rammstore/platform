import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificationRatingsAllComponent } from './specification-ratings-all.component';

describe('SpecificationRatingsAllComponent', () => {
  let component: SpecificationRatingsAllComponent;
  let fixture: ComponentFixture<SpecificationRatingsAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecificationRatingsAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecificationRatingsAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
