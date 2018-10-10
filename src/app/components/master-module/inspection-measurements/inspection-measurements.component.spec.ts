import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionMeasurementsComponent } from './inspection-measurements.component';

describe('InspectionMeasurementsComponent', () => {
  let component: InspectionMeasurementsComponent;
  let fixture: ComponentFixture<InspectionMeasurementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspectionMeasurementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectionMeasurementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
