import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { setTranslateLoader } from '../../app.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

import { RegistroPage } from './registro.page';

const routes: Routes = [
  {
    path: '',
    component: RegistroPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpClientModule, 
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader, 
        useFactory: (setTranslateLoader), deps: [HttpClient]
      }
    }),
    RouterModule.forChild(routes)
  ],
  declarations: [RegistroPage]
})
export class RegistroPageModule {}
