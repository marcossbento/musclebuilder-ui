import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionRunnerComponent } from './session-runner.component';

describe('SessionRunnerComponent', () => {
  let component: SessionRunnerComponent;
  let fixture: ComponentFixture<SessionRunnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SessionRunnerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SessionRunnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
