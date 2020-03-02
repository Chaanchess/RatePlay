import { Component, OnInit } from '@angular/core';
import { ForoService, foro } from '../servicios/foro.service';
import { ModalController } from "@ionic/angular";
import { ModalchatComponent } from '../modalchat/modalchat.component';
import { LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
/**
 * En esta clase se mostrarán los dos foros que hay guardados en la base de datos
 */
export class Tab3Page implements OnInit {
  public foros: any = []; //array donde se guardarán los foros de nuestra base de datos
  myloading: any;
  
  constructor(
    private foro: ForoService,
    private loadingController: LoadingController,
    private translate: TranslateService,
    private modal: ModalController
  ) { }

  /**
   * Al abrirse esta pestaña, obtendremos 
   * los foros que hay guardados en nuestra base de datos
   * una vez obtenidos, se guardarán en nuestro
   * array local. 
   */ 
  ngOnInit() {
    this.myloading = this.presentLoading(this.translate.instant("loading")).then(() => {
      this.foro.getChatRooms().subscribe(foros => { 
        
        this.foros = foros; 
        this.loadingController.dismiss();
      })
        
      }).catch(err => {
        this.loadingController.dismiss();
      });
    
  }

  /**
   * Método para abrir el modal de los mensajes del foro
   * @param foro Foro que se abrirá para ver los mensajes que hay en su interior
   */
  openChat(foro) {

    this.modal.create({
      component: ModalchatComponent,
      componentProps: {
        foro: foro
      }
    }).then((modal) => modal.present())
  }

  async presentLoading(msg) {
    this.myloading = await this.loadingController.create({
      message: msg
    });
    return await this.myloading.present();
  }
}
