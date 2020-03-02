import { Component, OnInit, ViewChild, HostListener, Sanitizer } from '@angular/core';
import { IonSlides, IonInfiniteScroll, LoadingController, ActionSheetController, Platform, ModalController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TodoservicioService } from '../servicios/todoservicio.service';
import { ToastController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';
import { juego } from "../models/juego";
import { ModalFavPage } from '../modal-fav/modal-fav.page';
import { AuthenticationService } from "../servicios/authentication.service";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

/**
 * En esta tab se van a mostrar todos los juegos que haya
guardados en la coleccion 'juegos' de la base de datos.
 */
export class Tab1Page implements OnInit {
  @ViewChild('SwipedTabsSlider') SwipedTabsSlider: IonSlides;
  @ViewChild('infiniteScroll') ionInfiniteScroll: IonInfiniteScroll;
  @ViewChild('dynamicList') dynamicList;

  SwipedTabsIndicator: any = null;
  tabs = ["selectTab(0)", "selectTab(1)"]; //número de tabs
  ntabs = 2; //cantidad de tabs
  public category: any = "0"; //indicador para saber en que slider nos encontramos
  listado = []; //array para guardar los juegos
  listadoPanel = []; //array que recorremos para mostrar los juegos
  listadoFav = []; //array que guarda los juegos favoritos
  listadoFavPanel = []; //array que recorremos para mostrar los juegos favoritos
  public isSearchBarOpen = false; //atributo booleano para que la searchbar se muestre al darle al icono
  user: any; //usuario que navega por la aplicación
  public juegos = []; //array para guardar los juegos favoritos


  constructor(private route: ActivatedRoute,
    private todoS: TodoservicioService,
    private translate: TranslateService,
    private toastCtrl: ToastController,
    public loadingController: LoadingController,
    private authService: AuthenticationService,
    private router: Router,

    public platform: Platform,
    public actionsheetCtrl: ActionSheetController,
    public modalController: ModalController) {

  }
  /**
   * Este método es llamado cada vez que se entra en esta
     página.
   */
  ionViewDidEnter() {
    this.SwipedTabsIndicator = document.getElementById("indicator");
    this.listado=this.listadoPanel;
    

  }

  /**
   * Método para mostrar un toast cuando se añade a favoritos
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

  /**
   * Método para mostrar un toast cuando se elimine de favoritos
   */
  async showDeleteTastFav() {
    const toast = await this.toastCtrl.create({
      message: this.translate.instant("DelFavgame"),
      showCloseButton: true,
      position: 'bottom',
      closeButtonText: 'Ok',
      duration: 2000
    });
    toast.present();
  }

  
  /**
   * Confirm necesario para aceptar si deseamos borrar el juego en nuestra coleccion de favoritos
   * @param id id del juego
   */
  async presentActionSheetDelfav(id, titulo, descripcion, puntuacion, dificultad, desarrolladora, fecha, img) {

    const actionSheet = await this.actionsheetCtrl.create({
      header: this.translate.instant("QuestDelfavgame"),
      buttons: [{
        text: this.translate.instant("yesask"),
        icon: 'trash',
        handler: () => {
          this.deleteFavoritesArray(id, titulo, descripcion, puntuacion, dificultad, desarrolladora, fecha, img);
          this.showDeleteTastFav();
          this.ionViewDidEnter();
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

  /**
   * El modal se abrirá con el valor de los atributos del juego que deseemos ver
   * @param id id del juego
   * @param titulo título del juego
   * @param descripcion descripción del juego
   * @param puntuacion puntuación del juego
   * @param dificultad dificultad del juego
   * @param desarrolladora desarrolladora del juego
   * @param fecha fecha del juego
   * @param img imagen del juego
   * @param refresher evento que indica si se ha hecho scroll hacia abajo
   */
  async presentModal(id, titulo, descripcion, puntuacion, dificultad, desarrolladora, fecha, img, refresher) {
    const modal = await this.modalController.create({
      component: ModalPage,
      componentProps: {
        id: id,
        titulo: titulo,
        descripcion: descripcion,
        puntuacion: puntuacion,
        dificultad: dificultad,
        desarrolladora: desarrolladora,
        fecha: fecha,
        img: img
      },
    });
    return await modal.present();
  }

  /**
   * El modal se abrirá con el valor de los atributos del juego favorito que deseemos ver
   * @param id id del juego
   * @param titulo título del juego
   * @param descripcion descripción del juego
   * @param puntuacion puntuación del juego
   * @param dificultad dificultad del juego
   * @param desarrolladora desarrolladora del juego
   * @param fecha fecha del juego
   * @param img imagen del juego
   * @param refresher evento que indica si se ha hecho scroll hacia abajo
   */
  async presentModalFav(id, titulo, descripcion, puntuacion, dificultad, desarrolladora, fecha, img, refresher) {
    const modal = await this.modalController.create({
      component: ModalFavPage,
      componentProps: {
        id: id,
        titulo: titulo,
        descripcion: descripcion,
        puntuacion: puntuacion,
        dificultad: dificultad,
        desarrolladora: desarrolladora,
        fecha: fecha,
        img: img
      },
    });
    return await modal.present();
  }

  /**
   * Método para cerrar el modal
   */
  closeModal() {
    this.modalController.dismiss();
  }

  /**
   * Método que se ejecuta cada vez que se entra a la tab
   */
  ionViewWillEnter() {
    this.category = "0";
    this.SwipedTabsSlider.length().then(l => {
      this.ntabs = l;
    });
  }

  /**
   * Método para saber en que slider se encuentra la 'rayita' de los segment
   */
  updateIndicatorPosition() {
    this.SwipedTabsSlider.getActiveIndex().then(i => {
      if (this.ntabs > i) {
        this.SwipedTabsIndicator.style.webkitTransform = 'translate3d(' + (i * 100) + '%,0,0)';
      }
    });
  }

  /**
   * Método para saber en que pestaña nos encontramos
   * @param cat categoría en la que nos encontramos; puede ser 'Juegos' o 'Favoritos'
   */
  updateCat(cat: Promise<any>) {
    cat.then(dat => {
      this.category = dat;
      this.category = +this.category;
    });
  }

  /**
   * El método que anima la "rayita" mientras nos estamos deslizando por el slide
   * @param e evento necesario para saber si hemos deslizado para pasar entre slides
   */
  animateIndicator(e) {
    if (this.SwipedTabsIndicator)
      this.SwipedTabsIndicator.style.webkitTransform = 'translate3d(' +
        ((e.target.swiper.progress * (this.ntabs - 1)) * 100) + '%,0,0)';
  }

  /**
   * Método para mostrar un loading
   * @param msg mensaje del loading
   */
  async presentLoading(msg) {
    let myloading = await this.loadingController.create({
      message: msg
    });
    return await myloading.present();
  }

  async delete() {
    await this.dynamicList.closeSlidingItems();
  }

  /**
   * Método para filtrar juegos en la searchbar
   * @param ev evento para saber si se ha modificado el texto escrito en la searchbar
   */
  getJuegos(ev: any) {
    var val = ev.target.value;
    this.listadoPanel = this.listado.filter((item) => {
      return (item.title.toLowerCase().indexOf(val.toLowerCase()) > -1);
    })
  }

  /**
   * Método para eliminar un juego de la lista de favoritos del usuario
   * @param id id del juego
   * @param titulo título del juego
   * @param descripcion descripción del juego
   * @param puntuacion puntuación del juego
   * @param dificultad dificultad del juego
   * @param desarrolladora desarrolladora del juego
   * @param fecha fecha del juego
   * @param img imagen del juego
   */
  deleteFavoritesArray(id, titulo, descripcion, puntuacion, dificultad, desarrolladora, fecha, img) {
    const juego: juego = {
      id: id,
      titulo: titulo,
      descripcion: descripcion,
      puntuacion: puntuacion,
      dificultad: dificultad,
      desarrolladora: desarrolladora,
      fechasalida: fecha,
      imagen: img
    }
    this.todoS.deleteJuegoFavoritos(juego, this.authService.getUserID());
  }

  ngOnInit() {
    console.log("El usuario es: " + this.authService.getUser());
    console.log("El id del usuario es: " + this.authService.getUserID());
    this.leeJuegos(null, true);
    this.todoS.getUserbyId(this.authService.getUserID()).subscribe(user => {
      this.user = user;
      this.juegos = user.juegos;
    })
  }
  
  /**
   *  Método que recoge los juegos de la base de datos y los introduce en el array
    necesario para poder mostrarlos. Está sincronizado para funcionar con el infinite scroll y el refresher
   */
  leeJuegos(event?, reload?) {
    if (!event)
    this.presentLoading(this.translate.instant("loading"));  //si se entrar por primera vez se muestra un loading
    
    this.todoS.getGames(reload).then(d => {
      if (reload) {
        this.listado = d;  //carga total
        this.listadoPanel=this.listado;  //igualamos el array que recorremos en la vista al array principal, asi se puede filtrar por busquedad de una forma mas eficaz
      } else {
        d.forEach((u) => {
          this.listado.push(u); //añadimos al final
        });
      }
      if (!event)
        this.loadingController.dismiss();
      if (event) {
        event.target.complete();
      }
       /*Comprobamos si hay más elementos a cargar o no. En caso afirmativo no desactivamos
       el infiniteScroll*/
      this.ionInfiniteScroll.disabled = !this.todoS.infiniteScrollActivado();
    });
    
  }




}
