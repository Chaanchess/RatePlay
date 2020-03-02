import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from '../app/servicios/authentication.service';
import { BackbuttonService } from './servicios/backbutton.service';
import { NetworkService } from './servicios/network.service';
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";
import { MenuController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

import { Platform, ModalController, NavController  } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ThemeSwitcherService } from './servicios/theme-switcher.service';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  skinmenu: any;
  langmenu: any;
  user: any;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private AFauth : AngularFireAuth,
    private navCtrl: NavController,
    private router : Router,
    private themeS: ThemeSwitcherService,
    private translate: TranslateService,
    private network: NetworkService,
    public modalController: ModalController,
    private back: BackbuttonService,
    private menuCtrl: MenuController,
    private authS: AuthenticationService,
    private alertController: AlertController
  ) {
    this.initializeApp();
    /**
     * Con esto controlamos la posición inicial de los toggle por defecto
     */
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

    //comprueba que haya variables de usuario guardadas en la base de datos local
    this.authS.initChecking().then(() => {
      this.translate.use(this.authS.getLang());
      this.themeS.setTheme(this.authS.getSkin());
      this.skinmenu = (this.authS.getSkin() == "light" ? false : true);
      this.langmenu = (this.authS.getLang() == "es" ? false : true);
    }).catch(err => {
      console.log(err);
    });
  }

  /**
   * Método para cambiar el idioma de la aplicación
   * @param e evento que comprueba si se ha cambiado la posición del toggle de seleccionar el idioma
   */
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

  /**
   * Método para cambiar el tema de la aplicación
   * @param e evento que comprueba si se ha cambiado la posición del toggle de seleccionar el tema
   */
  changeSkin(e) {
    if (e.detail.checked) {
      this.authS.setSkin("dark");
      this.themeS.setTheme("dark");
    } else {
      this.authS.setSkin("light");
      this.themeS.setTheme("light");
    }
  }


  /**
   * Método para confirmar si el usuario desea cerrar sesión y salir de la aplicación
   */
  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: this.translate.instant("logout"),
      message: this.translate.instant("suretologout"),
      buttons: [
        {
          text: this.translate.instant("decline"),
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: this.translate.instant("salir"),
          handler: () => {
            this.logOut();
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }


  /**
   * Método para cerrar el modal
   */
  closeModal() {
    this.modalController.dismiss();
  }

  /**
   * Método para cerrar sesión, que llama
   * a nuestro servicio de autenticación
   */
  logOut() {
    //this.presentLoading();
    this.authS.logout();
  }

   /**
   * Método para cerrar el menu lateral cuando se cierre sesión
   */
  toggleMenu() {
    this.menuCtrl.toggle(); //Add this method to your button click function
  }
}
