import { Component, OnInit, ViewChild, HostListener, Sanitizer } from '@angular/core';
import { IonSlides, IonInfiniteScroll, LoadingController, ActionSheetController, Platform, ModalController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TodoservicioService } from '../servicios/todoservicio.service';
import { ToastController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

/*
En esta tab se van a mostrar todos los juegos que haya
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

  constructor(private route: ActivatedRoute,
    private todoS: TodoservicioService,
    private translate: TranslateService,
    private toastCtrl: ToastController,
    public loadingController: LoadingController,
    private router: Router,
    public platform: Platform,
    public actionsheetCtrl: ActionSheetController,
    public modalController: ModalController) {

  }

  /*
  Método que recoge los juegos de la base de datos y los introduce en el array
  necesario para poder mostrarlos. Este método es llamado cada vez que se entra en esta
  página.
  */
  ionViewDidEnter() {
    this.presentLoading(this.translate.instant("loading"));
    this.SwipedTabsIndicator = document.getElementById("indicator");
    this.todoS.leeJuegos()
      .subscribe((querySnapshot) => {
        this.listado = [];
        this.delete();
        querySnapshot.forEach((doc) => {
          this.listado.push({ id: doc.id, ...doc.data() });
        });
        this.listadoPanel = this.listado;
        this.loadingController.dismiss();
      });
    this.todoS.leeJuegosFavoritos()
      .subscribe((querySnapshot) => {
        this.listadoFav = [];
        this.delete();
        querySnapshot.forEach((doc) => {
          this.listadoFav.push({ id: doc.id, ...doc.data() });
        });
        this.listadoFavPanel = this.listadoFav;
        this.loadingController.dismiss();
      });
  }

  async showTastFav() {
    //método para mostrar un toast
    const toast = await this.toastCtrl.create({
      message: this.translate.instant("Favgame"),
      showCloseButton: true,
      position: 'bottom',
      closeButtonText: 'Ok',
      duration: 2000
    });
    toast.present();
  }

  async showDeleteTastFav() {
    //método para mostrar un toast
    const toast = await this.toastCtrl.create({
      message: this.translate.instant("DelFavgame"),
      showCloseButton: true,
      position: 'bottom',
      closeButtonText: 'Ok',
      duration: 2000
    });
    toast.present();
  }

  doRefresh(refresher) {
    //refresher necesario para actualizar la lista de juegos cuando se hace scroll
    this.todoS.leeJuegos()
      .subscribe(querySnapshot => {
        this.listado = [];
        this.delete();
        querySnapshot.forEach((doc) => {
          this.listado.push({ id: doc.id, ...doc.data() });
        });
        this.listadoPanel = this.listado;
        refresher.target.complete();
      });
  }

  doRefreshFav(refresher) {
    //refresher necesario para actualizar la lista de juegos favoritos cuando se hace scroll
    this.todoS.leeJuegosFavoritos()
      .subscribe(querySnapshot => {
        this.listadoFav = [];
        this.delete();
        querySnapshot.forEach((doc) => {
          this.listadoFav.push({ id: doc.id, ...doc.data() });
        });
        this.listadoFavPanel = this.listadoFav;
        refresher.target.complete();
      });
  }

  doRefreshModal(refresher) {
    //este refresher hace su función cuando se cierra el modal para recargar si hemos cambiado algo
    this.presentLoading("Actualizando");
    this.todoS.leeJuegos()
      .subscribe(querySnapshot => {
        this.listado = [];
        this.delete();
        querySnapshot.forEach((doc) => {
          this.listado.push({ id: doc.id, ...doc.data() });
        });
        this.listadoPanel = this.listado;
        this.loadingController.dismiss();
        refresher.target.complete();
      });
  }

  doRefreshModalFav(refresher) {
    //este refresher hace su función cuando se cierra el modal para recargar si hemos cambiado algo
    this.presentLoading("Actualizando");
    this.todoS.leeJuegosFavoritos()
      .subscribe(querySnapshot => {
        this.listadoFav = [];
        this.delete();
        querySnapshot.forEach((doc) => {
          this.listadoFav.push({ id: doc.id, ...doc.data() });
        });
        this.listadoFavPanel = this.listadoFav;
        this.loadingController.dismiss();
        refresher.target.complete();
      });
  }

  async presentActionSheet(id, titulo, descripcion, puntuacion, dificultad) {
    //confirm necesario para aceptar si deseamos guardar el juego en nuestra coleccion de favoritos
    const actionSheet = await this.actionsheetCtrl.create({
      header: this.translate.instant("Addfavgame"),
      buttons: [{
        text: this.translate.instant("add"),
        icon: 'star',
        handler: () => {
          this.addfavorites(id, titulo, descripcion, puntuacion, dificultad);
          this.showTastFav();
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

  async presentActionSheetDelfav(id) {
    //confirm necesario para aceptar si deseamos borrar el juego en nuestra coleccion de favoritos
    const actionSheet = await this.actionsheetCtrl.create({
      header: this.translate.instant("QuestDelfavgame"),
      buttons: [{
        text: this.translate.instant("yesask"),
        icon: 'trash',
        handler: () => {
          this.deleteFavorites(id);
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

  async presentModal(id, titulo, descripcion, puntuacion, dificultad, desarrolladora, fecha, img, refresher) {
    const modal = await this.modalController.create({
      component: ModalPage,
      /* El modal se abrirá con el valor de los atributos del juego que deseemos ver */
      componentProps: {
        id: id,
        titulo: titulo,
        descripcion: descripcion,
        puntuacion: puntuacion,
        dificultad: dificultad,
        desarrolladora: desarrolladora,
        fecha: fecha,
        img:img
      },
    });
    return await modal.present();
  }

  //método para cerrar el modal
  closeModal() {
    this.modalController.dismiss();
  }

  ionViewWillEnter() {
    this.category = "0";
    this.SwipedTabsSlider.length().then(l => {
      this.ntabs = l;
    });
  }

  //método para saber en que slider se encuentra la 'rayita' de los segment
  updateIndicatorPosition() {
    this.SwipedTabsSlider.getActiveIndex().then(i => {
      if (this.ntabs > i) { 
        this.SwipedTabsIndicator.style.webkitTransform = 'translate3d(' + (i * 100) + '%,0,0)';
      }
    });
  }

  updateCat(cat: Promise<any>) {
    cat.then(dat => {
      this.category = dat;
      this.category = +this.category;
    });
  }

  /* El método que anima la "rayita" mientras nos estamos deslizando por el slide*/
  animateIndicator(e) {
    if (this.SwipedTabsIndicator)
      this.SwipedTabsIndicator.style.webkitTransform = 'translate3d(' +
        ((e.target.swiper.progress * (this.ntabs - 1)) * 100) + '%,0,0)';
  }

  //método para mostrar un loading
  async presentLoading(msg) {
    let myloading = await this.loadingController.create({
      message: msg
    });
    return await myloading.present();
  }

  async delete() { 
    await this.dynamicList.closeSlidingItems();
  }

  //método para filtrar juegos en la searchbar
  getJuegos(ev: any) {
    var val = ev.target.value;
    this.listadoPanel = this.listado.filter((item) => {
      return (item.title.toLowerCase().indexOf(val.toLowerCase()) > -1);
    })
  }

  //método para añadir juegos a nuestra coleccion de favoritos
  addfavorites(id, titulo, descripcion, puntuacion, dificultad) {
    console.log(titulo);
    let data = {
      title: titulo,
      description: descripcion,
      puntuacion: puntuacion,
      dificultad: dificultad
    };
    this.todoS.agregaJuegoFav(id, data);
  }

  //método para eliminar juegos a nuestra coleccion de favoritos
  deleteFavorites(id){
    console.log(id);
    this.todoS.deleteJuegoFav(id);
    this.showDeleteTastFav();
  }

  ngOnInit() {

  }

  


}
