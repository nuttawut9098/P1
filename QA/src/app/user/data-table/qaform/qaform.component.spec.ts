import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QaformComponent } from './qaform.component';

describe('QaformComponent', () => {
  let component: QaformComponent;
  let fixture: ComponentFixture<QaformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QaformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QaformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
