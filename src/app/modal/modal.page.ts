import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController, NavController, LoadingController, ActionSheetController, ToastController } from '@ionic/angular';
import { TodoservicioService } from '../servicios/todoservicio.service';
import { TranslateService } from '@ngx-translate/core';
import { BackbuttonService } from '../servicios/backbutton.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})

/*
  Esta clase es un modal que se encarga de 
  mostrar la información del juego que el 
  usuario desee cuando acceda a él.
*/
export class ModalPage implements OnInit {
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
    private backButt: BackbuttonService,
    private toastCtrl: ToastController,
    private loadingController: LoadingController,
    private todoS: TodoservicioService) {
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

  /*
  Método que se encarga de controlar que los campos no se puedan editar.
  */
  isReadonly() { return true; }


  /*
  Este actionSheet se encarga de mostrar un mensaje de confirmación
  de si realmente deseamos añadir el juego a nuestra lista de favoritos.
  Necesita recibir los atributos del juego para añadirlo correctamente
  a la base de datos.
  */
  async presentActionSheet(id, titulo, descripcion, puntuacion, dificultad, desarrolladora, fecha, img) {
    const actionSheet = await this.actionsheetCtrl.create({
      header: this.translate.instant("Addfavgame"),
      buttons: [{
        text: this.translate.instant("add"),
        icon: 'star',
        handler: () => {
          this.addfavorites(id, titulo, descripcion, puntuacion, dificultad, desarrolladora, fecha, img);
          this.showTastFav();
        }
      }, {
        text: this.translate.instant("cancel"),
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  /*
  Método que se encargar de añadir el juego a la coleccion de 
  favoritos de la base de datos.
  */
  addfavorites(id, titulo, descripcion, puntuacion, dificultad, desarrolladora, fecha, img) {
    console.log(titulo);
    let data = {
      title: titulo,
      description: descripcion,
      puntuacion: puntuacion,
      dificultad: dificultad,
      desarrolladora: desarrolladora,
      fecha: fecha,
      img: img
    };
    this.todoS.agregaJuegoFav(id, data);
  }

  /*
  Método que muestra un toast con un mensaje de información
  para el usuario.
  */
  async showTastFav() {
    const toast = await this.toastCtrl.create({
      message: this.translate.instant("Favgame"),
      showCloseButton: true,
      position: 'bottom',
      closeButtonText: 'Ok',
      duration: 2000
    });
    toast.present();
  }

  /*
  Método para cerrar el modal.
  */
  closeModal() {
    this.modalCtrl.dismiss();
  }

  /*
  Al abrirse el modal accedemos a nuestro servicio
  de backbutton y ponemos el atributo booleano 'openModal'
  a true para saber que se trata de un modal. 
  */
  ngOnInit() {
    this.backButt.openModal = true;
  }

}
