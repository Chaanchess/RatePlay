import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from '../app/servicios/authentication.service';
import { BackbuttonService } from './servicios/backbutton.service';
import { NetworkService } from './servicios/network.service';

import { Platform, ModalController, NavController  } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ThemeSwitcherService } from './servicios/theme-switcher.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AcercadePage } from './acercade/acercade.page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  skinmenu: any;
  langmenu: any;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private navCtrl: NavController,
    private themeS: ThemeSwitcherService,
    private translate: TranslateService,
    private network: NetworkService,
    public modalController: ModalController,
    private back: BackbuttonService,
    private authS: AuthenticationService
  ) {
    this.initializeApp();
    /*Con esto controlamos la posición inicial de los toggle por defecto*/
    this.skinmenu = (environment.defaultSkin == "light" ? false : true);
    this.langmenu = (environment.defaultLanguage == "es" ? false : true);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.translate.addLangs(environment.currentLanguages);
      //cargamos el lenguaje por defecto
      this.translate.setDefaultLang(environment.defaultLanguage);

      if (this.translate.getBrowserLang) {  //coge el idioma del navegador
        if (environment.currentLanguages.includes(this.translate.getBrowserLang())) {
          this.translate.use(this.translate.getBrowserLang());
        }
      }

      //cargamos el tema por defecto
      this.themeS.setTheme(environment.defaultSkin);

    });

    //método que comprueba que haya variables de usuario guardadas en la base de datos local
    this.authS.initChecking().then(() => {
      this.translate.use(this.authS.getLang());
      this.themeS.setTheme(this.authS.getSkin());
      this.skinmenu = (this.authS.getSkin() == "light" ? false : true);
      this.langmenu = (this.authS.getLang() == "es" ? false : true);
    }).catch(err => {
      console.log(err);
    });
  }

  //método para cambiar el idioma de la aplicación
  changeLang(e) {
    console.log("estoy dentro");
    if (e.detail.checked) {
      this.authS.setLang("en");
      this.translate.use("en");
    } else {
      this.authS.setLang("es");
      this.translate.use("es");
    }
  }

  //método para cambiar el tema de la aplicación
  changeSkin(e) {
    if (e.detail.checked) {
      this.authS.setSkin("dark");
      this.themeS.setTheme("dark");
    } else {
      this.authS.setSkin("light");
      this.themeS.setTheme("light");
    }
  }

  //método para abrir el modal del acerca de
  async presentModal() {
    const modal = await this.modalController.create({
      component: AcercadePage,
      componentProps: {
      },
    });
    return await modal.present();
  }

  //método para cerrar el modal
  closeModal() {
    this.modalController.dismiss();
  }
}
