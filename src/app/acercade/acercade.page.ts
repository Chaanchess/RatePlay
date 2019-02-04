import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { BackbuttonService } from '../servicios/backbutton.service';

@Component({
  selector: 'app-acercade',
  templateUrl: './acercade.page.html',
  styleUrls: ['./acercade.page.scss'],
})

/*
Esta clase es un modal que simplemente muestra
la información de la aplicación y del desarrollador
de la misma.
*/
export class AcercadePage implements OnInit {

  constructor(
    private modalCtrl: ModalController,
    private backButt: BackbuttonService,
    private translate: TranslateService,
  ) { }

  /*
  Al abrirse el modal accedemos a nuestro servicio
  de backbutton y ponemos el atributo booleano 'openModal'
  a true para saber que se trata de un modal. 
  */
  ngOnInit() {
    this.backButt.openModal=true;
  }

  /*
  Método para cerrar el modal.
  */
  closeModal() {
    this.modalCtrl.dismiss();
  }

}
