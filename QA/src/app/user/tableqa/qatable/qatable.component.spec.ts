import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QatableComponent } from './qatable.component';

describe('QatableComponent', () => {
  let component: QatableComponent;
  let fixture: ComponentFixture<QatableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QatableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
