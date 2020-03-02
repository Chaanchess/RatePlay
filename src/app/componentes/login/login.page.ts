import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from "../../servicios/authentication.service";
import { Router } from "@angular/router";
import { LoadingController, ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AcercadePage } from '../../acercade/acercade.page';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
/**
 * Clase que se encarga de controlar el inicio de sesión de los 
 * usuario en la aplicación.
 */
export class LoginPage implements OnInit {

  email: string; //email del usuario
  password: string; //contraseña del usuario
  myloading: any;

  constructor(
    private authService: AuthenticationService,
    private translate: TranslateService,
    public router: Router,
    public modalController: ModalController,
    public alertController: AlertController,
    public loadingController: LoadingController
  ) { }

  ngOnInit() {
  }

  /**
 * Método que se encarga de que el usuario inicie sesión en la aplicación.
 * Comprueba que el email y la contraseña introducidas son correctas.
 */
  onSubmitLogin() {
    this.myloading = this.presentLoading(this.translate.instant("iniciandoSesion")).then(() => {
      this.authService.login(this.email, this.password).then(() => {
        this.router.navigate(['/tabs/tab1']);
        this.loadingController.dismiss();
      }).catch(err => {
        this.loadingController.dismiss().then(() => {
          this.presentAlert();
        });
      });
    });

  }

  /**
 * Método para navergar a la pantalla de registro
 */
  registro() {
    this.router.navigate(['/registro']);
  }

  /**
 * Método para mostrar un loading
 */
  async presentLoading(msg) {
    this.myloading = await this.loadingController.create({
      message: msg
    });
    return await this.myloading.present();
  }

  /**
 * Método para mostrar un alert en caso de que el inicio de sesión haya sido incorrecto
 */
  async presentAlert() {
    const alert = await this.alertController.create({
      header: this.translate.instant("errorLogin1"),
      subHeader: this.translate.instant("errorLogin2"),
      message: this.translate.instant("errorLogin3"),
      buttons: ['OK']
    });

    await alert.present();
  }

  /**
   * Método para abrir el modal del acerca de
   */
  async presentModal() {
    const modal = await this.modalController.create({
      component: AcercadePage,
      componentProps: {
      },
    });
    return await modal.present();
  }

}
