import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificationRatingsComponent } from './specification-ratings.component';

describe('SpecificationRatingsComponent', () => {
  let component: SpecificationRatingsComponent;
  let fixture: ComponentFixture<SpecificationRatingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecificationRatingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecificationRatingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
