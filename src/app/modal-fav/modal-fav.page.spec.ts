import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFavPage } from './modal-fav.page';

describe('ModalFavPage', () => {
  let component: ModalFavPage;
  let fixture: ComponentFixture<ModalFavPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalFavPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalFavPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
