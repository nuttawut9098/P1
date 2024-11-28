import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LisstComponent } from './lisst.component';

describe('LisstComponent', () => {
  let component: LisstComponent;
  let fixture: ComponentFixture<LisstComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LisstComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LisstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
