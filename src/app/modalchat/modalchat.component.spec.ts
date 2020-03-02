import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalchatComponent } from './modalchat.component';

describe('ModalchatComponent', () => {
  let component: ModalchatComponent;
  let fixture: ComponentFixture<ModalchatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalchatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalchatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
