import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMissionComponent } from './dashboard-mission.component';

describe('DashboardMissionComponent', () => {
  let component: DashboardMissionComponent;
  let fixture: ComponentFixture<DashboardMissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardMissionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardMissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
