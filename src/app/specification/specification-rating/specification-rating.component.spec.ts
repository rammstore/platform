import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificationRatingComponent } from './specification-rating.component';

describe('SpecificationRatingComponent', () => {
  let component: SpecificationRatingComponent;
  let fixture: ComponentFixture<SpecificationRatingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecificationRatingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecificationRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
