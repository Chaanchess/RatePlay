import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { setTranslateLoader } from '../app.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { IonicModule } from '@ionic/angular';

import { ModalPage } from './modal.page';

const routes: Routes = [
  {
    path: '',
    component: ModalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    HttpClientModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader, 
        useFactory: (setTranslateLoader), deps: [HttpClient]
      }
    }),
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ModalPage]
})
export class ModalPageModule {}
