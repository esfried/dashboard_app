import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenBaseComponent } from './screen-base.component';

describe('ScreenBaseComponent', () => {
  let component: ScreenBaseComponent;
  let fixture: ComponentFixture<ScreenBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScreenBaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScreenBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
