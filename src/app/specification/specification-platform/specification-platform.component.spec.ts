import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificationPlatformComponent } from './specification-platform.component';

describe('SpecificationPlatformComponent', () => {
  let component: SpecificationPlatformComponent;
  let fixture: ComponentFixture<SpecificationPlatformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecificationPlatformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecificationPlatformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
