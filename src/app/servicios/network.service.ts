import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { TodoservicioService } from '../servicios/todoservicio.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
 /**
  * Es el servicio que controla si hay red, en caso negativo lo comunica al usuario y al servicio cloud
 cuando vuelve la red lo comunica al usuario y al servicio cloud.
  */
export class NetworkService {
  isConnected;
  disconnectSubscription;
  connectSubscription;

  constructor(private network: Network, private toastCtrl: ToastController,
    private cloud: TodoservicioService, private translate: TranslateService) {
    this.isConnected = true;
    this.disconnectSubscription = this.network.onDisconnect().subscribe(() => { 
      console.log('network was disconnected :-(');
      this.isConnected = false;
      this.cloud.isConnected = this.isConnected;
      this.showToastNoInternet();
    });
    this.connectSubscription = this.network.onConnect().subscribe(() => { 
      console.log('network connected!');
      // We just got a connection but we need to wait briefly
      // before we determine the connection type. Might need to wait.
      // prior to doing any api requests as well.
      setTimeout(() => {
        if (this.isConnected == false) {
          this.isConnected = true;
          this.cloud.isConnected = this.isConnected;
          this.showToastInternet();
        }
      }, 3000);
    });
  }

  /**
   * Muestra un toast en el caso de que recuperemos la conexión
   */
  async showToastInternet() {
    const toast = await this.toastCtrl.create({
      message: this.translate.instant("internet") + this.network.type,
      showCloseButton: true,
      position: 'bottom',
      closeButtonText: 'Ok',
      duration: 2000
    });
    toast.present();
  }

  /**
   * Muestra un toast en el caso de que perdamos la conexión
   */
  async showToastNoInternet() {
    const toast = await this.toastCtrl.create({
      message: this.translate.instant("nointernet"),
      showCloseButton: true,
      position: 'bottom',
      closeButtonText: 'Ok',
      duration: 2000
    });
    toast.present();
  }
}
