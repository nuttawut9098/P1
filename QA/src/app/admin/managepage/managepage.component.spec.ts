import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagepageComponent } from './managepage.component';

describe('ManagepageComponent', () => {
  let component: ManagepageComponent;
  let fixture: ComponentFixture<ManagepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagepageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
