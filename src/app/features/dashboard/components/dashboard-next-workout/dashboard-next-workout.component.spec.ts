import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardNextWorkoutComponent } from './dashboard-next-workout.component';

describe('DashboardNextWorkoutComponent', () => {
  let component: DashboardNextWorkoutComponent;
  let fixture: ComponentFixture<DashboardNextWorkoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardNextWorkoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardNextWorkoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
