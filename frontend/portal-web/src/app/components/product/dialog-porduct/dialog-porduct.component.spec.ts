import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPorductComponent } from './dialog-porduct.component';

describe('DialogPorductComponent', () => {
  let component: DialogPorductComponent;
  let fixture: ComponentFixture<DialogPorductComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogPorductComponent]
    });
    fixture = TestBed.createComponent(DialogPorductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
