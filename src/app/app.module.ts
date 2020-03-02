import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule} from 'angularfire2/firestore'; 
import { environment } from '../environments/environment';
import { TranslateModule, TranslateLoader,TranslatePipe } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicStorageModule } from '@ionic/storage';
import { BackbuttonService } from './servicios/backbutton.service';
import { AuthenticationService } from '../app/servicios/authentication.service';
import { ModalPage } from './modal/modal.page';
import { AcercadePage } from './acercade/acercade.page';
import { Camera } from '@ionic-native/camera/ngx';
import { NetworkService } from './servicios/network.service';
import { Network } from '@ionic-native/network/ngx';
import { AngularFireAuthModule } from "@angular/fire/auth";
import { Keyboard } from '@ionic-native/keyboard/ngx';


import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ThemeSwitcherService } from './servicios/theme-switcher.service';
import { ModalFavPage } from './modal-fav/modal-fav.page';
import { ModalchatComponent } from './modalchat/modalchat.component';
export function setTranslateLoader(http: any) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent, ModalPage, AcercadePage, ModalFavPage, ModalchatComponent],
  entryComponents: [ModalPage, AcercadePage, ModalFavPage, ModalchatComponent],
  imports: [BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    AngularFirestoreModule,
    ReactiveFormsModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    FormsModule,
    HttpClientModule, TranslateModule.forRoot({  //Módulo de traducción
      loader: {
        provide: TranslateLoader, 
        useFactory: (setTranslateLoader), 
        deps: [HttpClient]
      }
    })],
  providers: [
    StatusBar,
    Camera,
    BackbuttonService,
    SplashScreen,
    Network,  
    Keyboard,
    NetworkService,
    AuthenticationService,
    ThemeSwitcherService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
