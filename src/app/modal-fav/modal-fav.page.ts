import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController, NavController, LoadingController, ActionSheetController, ToastController } from '@ionic/angular';
import { TodoservicioService } from '../servicios/todoservicio.service';
import { TranslateService } from '@ngx-translate/core';
import { BackbuttonService } from '../servicios/backbutton.service';

@Component({
  selector: 'app-modal-fav',
  templateUrl: './modal-fav.page.html',
  styleUrls: ['./modal-fav.page.scss'],
})
export class ModalFavPage implements OnInit {
  /*
    Se crean todos los atributos del juego
    que el modal recibe cuando el usuario le
    da a la 'card' del respectivo juego.
    */
  private todo: FormGroup;
  id: any;
  titulo: any;
  descripcion: any;
  puntuacion: any;
  dificultad: any;
  desarrolladora: any;
  fecha: any;
  img: any;
  myloading: any;
  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    nav: NavController,
    private modalCtrl: ModalController,
    public actionsheetCtrl: ActionSheetController,
    private backButt: BackbuttonService) {
    /* Iniciamos el formulario con los valores del juego 
      que hayamos elegido */
    this.todo = this.formBuilder.group({
      title: [this.titulo, Validators.required],
      description: [this.descripcion, Validators.required],
      puntuacion: [this.puntuacion, [Validators.required, Validators.min(1), Validators.max(10)]],
      dificultad: [this.dificultad, Validators.required],
      desarrolladora: [this.desarrolladora, Validators.required],
      fecha: [this.fecha, Validators.required]
    });
  }


  isReadonly() { return true; }

  closeModal() {
    this.modalCtrl.dismiss();
  }


  ngOnInit() {
    this.backButt.openModal = true;
  }

}
