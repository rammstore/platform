import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificationInfoBlockComponent } from './specification-info-block.component';

describe('SpecificationInfoBlockComponent', () => {
  let component: SpecificationInfoBlockComponent;
  let fixture: ComponentFixture<SpecificationInfoBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecificationInfoBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecificationInfoBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
