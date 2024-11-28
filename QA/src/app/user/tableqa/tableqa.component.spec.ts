import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableqaComponent } from './tableqa.component';

describe('TableqaComponent', () => {
  let component: TableqaComponent;
  let fixture: ComponentFixture<TableqaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableqaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableqaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
