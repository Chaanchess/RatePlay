import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TodoservicioService } from '../servicios/todoservicio.service';
import { LoadingController, IonImg } from '@ionic/angular';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
/* 
Esta clase es un formulario con los campos necesarios para añadir
juegos a la base de datos.
*/
export class Tab2Page {
  @ViewChild('mifoto') elemElem:IonImg; //instancia de la imagen
  private todo: FormGroup; //Instancia del FormGroup
  myloading: any;
  myphoto:any;
  public photo = false;

  constructor(private formBuilder: FormBuilder,
    private todoS: TodoservicioService,
    private camera: Camera,
    private router: Router,
    private toastCtrl: ToastController,
    private translate:TranslateService,
    public loadingController: LoadingController) {
    /* Creamos el formulario; además
   asociamos los validares y valores iniciales */
    this.todo = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      puntuacion: ['', [Validators.required, Validators.min(1), Validators.max(10)]],
      dificultad: ['', Validators.required],
      desarrolladora: ['', Validators.required],
      fecha: ['', Validators.required]
    });
  }

  //método para enviar el contenido del formulario a la base de datos
  logForm() {
    if (this.photo==false){
      this.showTastFav();
    }
    let data = {
      title: this.todo.get("title").value,
      description: this.todo.get("description").value,
      puntuacion: this.todo.get("puntuacion").value,
      dificultad: this.todo.get("dificultad").value,
      desarrolladora: this.todo.get("desarrolladora").value,
      fecha: this.todo.get("fecha").value,
      img: this.elemElem.src
    };
    /* Mostramos el cargando... */
    this.myloading = this.presentLoading();
    this.todoS.agregaJuego(data)
      .then((docRef) => {
        console.log("ID insertado (por si lo necesitamos para algo...): ", docRef.id);
        /* Ponemos en blanco los campos del formulario*/
        this.todo.setValue({
          title: '',
          description: '',
          puntuacion:'',
          dificultad:'',
          desarrolladora:'',
          fecha:''
        });
        /* Cerramos el cargando...*/
        this.loadingController.dismiss();
        /*Podríamos ir a la página de listado*/
        this.router.navigateByUrl('/tabs/tab1');
        this.photo=false;
      })
      .catch((error) => {
        console.error("Error insertando documento: ", error);
        /* Cerramos el cargando...*/
        this.loadingController.dismiss();
      });
  }

  /*Método para mostrar el loading*/
  async presentLoading() {
    this.myloading = await this.loadingController.create({
      message: this.translate.instant("Saving")
    });
    return await this.myloading.present();
  }

  /*Método para seleccionar una imagen de nuestra galería*/
  getImage(){
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum:false
    }

    this.camera.getPicture(options).then((imageData) => {
      this.myphoto='data:image/jpeg;base64, ' + imageData; //transformar la imagen a base64 para subirla a la base de datos
    })
    this.photo=true;
  }

  /*Método para mostrar un toast en caso de que no se haya seleccionado una imagen*/
  async showTastFav() {
    const toast = await this.toastCtrl.create({
      message: this.translate.instant("takeimage"),
      showCloseButton: true,
      position: 'bottom',
      closeButtonText: 'Ok',
      duration: 2000
    });
    toast.present();
  }
}
