import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeresetComponent } from './timereset.component';

describe('TimeresetComponent', () => {
  let component: TimeresetComponent;
  let fixture: ComponentFixture<TimeresetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimeresetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeresetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
