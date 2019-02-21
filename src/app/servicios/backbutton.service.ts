import { Injectable } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
import { Router, NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
/**
 * Este servicio controla el comportamiento del botón atrás en la aplicación
 */
export class BackbuttonService {
  exitB: any;
  currentURL: any = "";
  haspressB: boolean = false;
  openModal = false;

  constructor(private platform: Platform,
    private navCtrl: NavController,
    private router: Router) {
    this.exitB = this.platform.backButton;
    this.exitB.subscribe(() => {
     /**
      * Comprobamos que no sea un modal la página en la que nos encontramos.
      Con esto conseguimos que al darle al botón de atrás en un modal no se cierre
      la aplicación.
      */
      if (!this.openModal) {
        /**
         * En caso de estar en la tab1 si se pulsa atrás se cierra la aplicación
         */
        if (this.currentURL == "/" || this.currentURL == "" || this.currentURL == "/tabs/tab1"){
          console.log("CIERRO")
          navigator['app'].exitApp();
         } else {
          console.log("atrasXXX")
          this.haspressB = true;  //indica que se ha pulsado hacia atrás.
        }
      }else{

        this.openModal=false;
      }
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) { 
        this.currentURL = event.url;
        if (this.haspressB) {  
          this.navCtrl.navigateRoot(['/tabs/tab1'], { animationDirection: "back" });
          console.log("atrasYYY")
          this.haspressB = !this.haspressB;
        } 

      }
    });

  }
}

