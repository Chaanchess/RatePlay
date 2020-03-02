import { Component, OnInit, ViewChild } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { ForoService } from '../servicios/foro.service';
import { message } from "../models/message";
import { AuthenticationService } from "../servicios/authentication.service";
import { BackbuttonService } from "../servicios/backbutton.service";
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-modalchat',
  templateUrl: './modalchat.component.html',
  styleUrls: ['./modalchat.component.scss']
})
/**
 * Esta clase es un modal que se encarga de 
  mostrar los mensajes de cada foro y de enviar
  mensajes al foro correspondiente.
 */
export class ModalchatComponent implements OnInit {
  @ViewChild('content') private content: any;
  public foro: any; //el foro seleccionado

  public messages = []; //array de mensajes del foro

  public room: any; //sala del foro a la que se accede con sus mensajes

  public msg: string; //mensaje que se envia al foro

  currentuser: any;

  isenabled: boolean = false;

  public scroll: any;

  myphoto: any;

  constructor(
    private navparams: NavParams,
    private modal: ModalController,
    private foroService: ForoService,
    private camera: Camera,
    private backButt: BackbuttonService,
    private keyboard: Keyboard,
    private authService: AuthenticationService) {
    this.msg = "";
    this.scroll = (environment.autoScroll == "no" ? false : true);
  }

  /**
  * Nada mas abrir el modal, se sabrá a que foro se ha accedido,
  * necesario para saber que mensajes debemos de mostrar en ese caso y comprobará
  * si el usuario desea que los mensajes se actualicen automáticamente
  */
  ngOnInit() {
    this.authService.initChecking().then(() => {

      this.scroll = (this.authService.getScroll() == "no" ? false : true);
    });
    this.currentuser = this.authService.getUser();

    this.foroService.getChatRoom(this.foro.id).subscribe(room => {
      console.log(room);
      this.room = room;
      if (this.authService.getScroll() == "si") {
        setTimeout(() => { this.content.scrollToBottom(300); }, 200);
      }

    })

    //se recoge el nombre del foro pasado desde el servicio
    this.foro = this.navparams.get('foro')
    this.backButt.openModal = true;
  }

  /**
   * Método para cerrar el modal
   */
  closeModal() {
    this.modal.dismiss()
  }

  /**
 * Este método se encarga de enviar un mensaje al
 * array de mensajes del foro seleccionado
 */
  sendMessage() {
    this.msg = this.msg.replace("\n", "");
    if (this.msg.length <= 0)
      return false;
    const mensaje: message = {
      //contenido del mensaje a enviar, con el email del usuario recogido de la base de datos local
      content: this.msg,
      autor: this.authService.getUser(),
      type: 'text',
      img: '',
      date: new Date()
    }
    this.foroService.sendMsgToFirebase(mensaje, this.foro.id);
    // setTimeout(()=>{this.content.scrollToBottom(300);},200);
    this.msg = "";
  }

  /**
 * Este método se encarga de enviar un mensaje con
 * una imagen de la galería de nuestro dispositivo móvil.
 */
  getImage() {
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false
    }

    this.camera.getPicture(options).then((imageData) => {
      this.myphoto = 'data:image/jpeg;base64, ' + imageData; //transformar la imagen a base64 para subirla a la base de datos
      const mensaje: message = {
        content: this.msg,
        autor: this.authService.getUser(),
        type: 'text',
        img: this.myphoto,
        date: new Date()
      }

      this.foroService.sendMsgToFirebase(mensaje, this.foro.id);
      this.msg = "";
    })
  }

  /**
 * Este método se encarga de enviar un mensaje con
 * una foto tomada desde nuestro dispositivo móvil.
 */
  getPhoto() {
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,  /*FILE_URI */
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      cameraDirection: 0,
      correctOrientation: true,
      saveToPhotoAlbum: false
    }

    this.camera.getPicture(options).then((imageData) => {
      this.myphoto = 'data:image/jpeg;base64, ' + imageData; //transformar la imagen a base64 para subirla a la base de datos
      const mensaje: message = {
        content: this.msg,
        autor: this.authService.getUser(),
        type: 'text',
        img: this.myphoto,
        date: new Date()
      }

      this.foroService.sendMsgToFirebase(mensaje, this.foro.id);
      this.msg = "";
    })
  }

  clearEnter() {
    this.msg = "";
  }
  /**
* Este método se encarga de cargar cargar los últimos mensajes
* enviando la pantalla hasta abajo del todo para ver asi los últimos enviados
*/
  scrollToBottomOnInit() {
    this.content.scrollToBottom(300);
  }

  /**
* Método que se ejecuta cada vez que se entra en la pantalla
*/
  ionViewDidEnter() {
    this.scrollToBottomOnInit();
  }

  /**
* Método que cambia el valor de scroll al cambiar la posición del toggle
*/
  changeScroll(e) {
    if (e.detail.checked) {
      this.authService.setScroll("si");
    } else {
      this.authService.setScroll("no");
    }
  }


}
