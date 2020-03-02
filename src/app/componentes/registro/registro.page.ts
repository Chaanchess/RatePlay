import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from "../../servicios/authentication.service";
import { Router } from "@angular/router";
import { LoadingController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
/**
 * Clase que se encarga de registrar un usuario en la base de datos de FirebaseAuth.
 */
export class RegistroPage implements OnInit {

  email: string="" //email del usuario
  password: string="" //contraseña del usuario
  myloading: any;
  constructor(public router: Router, 
    private translate: TranslateService,
    public loadingController:LoadingController,
    public alertController: AlertController,
    private authService: AuthenticationService) { }

  ngOnInit() {
  }

  /**
 * Método para volver a la pantalla del login
 */
  volverLogin(){
    this.router.navigate(['/login']);
  }

  /**
 * Método para registrar al usuario en la base de datos. Se necesita
 * su email y contraseña.
 * Se llama al método register del servicio de autenticación
 */
  onSubmitRegister(){
    this.myloading = this.presentLoading(this.translate.instant("iniciandoSesion")).then(() => {
      this.authService.register(this.email, this.password).then(() => {
        this.router.navigate(['/tabs/tab1']);
        this.loadingController.dismiss();
        this.email=""
        this.password=""
      }).catch(err => {
        this.loadingController.dismiss().then(() => {
          this.presentAlert();
        });
      });
    });
  
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
 * Método para mostrar un alert en caso de que ocurra un fallo
 * al registrar un usuario.
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

}
