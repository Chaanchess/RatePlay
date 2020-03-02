import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { setTranslateLoader } from '../app.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { IonicModule } from '@ionic/angular';

import { AcercadePage } from './acercade.page';

const routes: Routes = [
  {
    path: '',
    component: AcercadePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    HttpClientModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader, 
        useFactory: (setTranslateLoader), deps: [HttpClient]
      }
    }),
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [/*AcercadePage*/]
})
export class AcercadePageModule {}
