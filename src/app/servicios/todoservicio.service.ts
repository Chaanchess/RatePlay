import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
/* Servicio que se encargar de realizar todas las operaciones necesarias
relacionadas con la base de datos de firebase.*/
export class TodoservicioService {
  myCollection: any;
  myFavs:any;
  queue = [];   //tareas a realizar cuando vuelva internet
  isConnected = true;
  constructor(private fireStore: AngularFirestore) {
    /* Crea una referencia a la colección 'todo' que empleamos para realizar las
   operaciones CRUD*/
    this.myCollection =
      fireStore.collection<any>(environment.firebaseConfig.juegoColeccion);
      this.myFavs=fireStore.collection<any>(environment.firebaseConfig.favoritosColeccion);
  }

  /* Método para añadir un juego a la colección 'juegos' de la base de datos*/
  agregaJuego(datos) {
    return this.myCollection.add(datos);
  }

  /* Método para añadir un juego a la colección 'favoritos' de la base de datos*/
  agregaJuegoFav(id, datos){
    return this.myFavs.doc(id).set(datos);
  }

  /* Método para eliminar un juego favorito de la base de datos*/
  deleteJuegoFav(id){
    return this.myFavs.doc(id).delete();
  }

  /* Método para recoger los juegos favoritos de la base de datos*/
  leeJuegosFavoritos() {
    return this.myFavs.get();
  }

  /* Método para recoger los juegos de la base de datos*/
  leeJuegos() {
    return this.myCollection.get();
  }

  /* Método para recoger un juego de la base de datos*/
  leeJuego(id) {
    return this.myCollection.doc(id).get();
  }

  /* Método para actualizar un juego de la base de datos*/
  actualizaJuego(id, data) {
    return this.myCollection.doc(id).set(data);
  }
  
  /* Método para borrar un juego de la base de datos*/
  borraJuego(id) {
    return this.myCollection.doc(id).delete();
  }

  
  doQueue() {
    /*
    Este método no está implementado, pero su funcionalidad consiste
    en que se realicen las operaciones necesarias cuando vuelva la conexión
    a internet.
   */
    while (this.isConnected && this.queue.length > 0) {
      let a = this.queue.pop()
      //TODO
    }
  }

}
