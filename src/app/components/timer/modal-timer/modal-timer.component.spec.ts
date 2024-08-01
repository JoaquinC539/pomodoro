import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTimerComponent } from './modal-timer.component';

describe('ModalTimerComponent', () => {
  let component: ModalTimerComponent;
  let fixture: ComponentFixture<ModalTimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalTimerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
