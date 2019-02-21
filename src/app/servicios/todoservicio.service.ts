import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
/**
 * Servicio que se encargar de realizar todas las operaciones necesarias relacionadas con la base de datos de firebase.
 */
export class TodoservicioService {
  myCollection: any;
  myFavs:any;
  queue = [];
  isConnected = true;
  constructor(private fireStore: AngularFirestore) {
   /**
    * Crea una referencia a la colección 'todo' que empleamos para realizar las operaciones CRUD
    */
    this.myCollection =
      fireStore.collection<any>(environment.firebaseConfig.juegoColeccion);
      this.myFavs=fireStore.collection<any>(environment.firebaseConfig.favoritosColeccion);
  }

 /**
  * Método que agrega un juego a la base de datos.
  * @param datos Son los datos del juego necesarios para añadirlo a la base de datos.
  * @returns Promise
  */
  agregaJuego(datos) {
    return this.myCollection.add(datos);
  }

  /**
  * Método que agrega un juego a la lista de favoritos.
  * @param id Es el id del juego necesario para añadir el juego a una coleccion de favoritos.
  * @param datos Son los datos del juego necesarios para añadirlo a la base de datos.
  * @returns Observable
  */
  agregaJuegoFav(id, datos){
    return this.myFavs.doc(id).set(datos);
  }

  /**
  * Método que eliminar un juego de favoritos.
  * @param id Es el id del juego necesario para eliminar un juego de favoritos.
  * @returns Observable
  */
  deleteJuegoFav(id){
    return this.myFavs.doc(id).delete();
  }

  /**
  * Método que obtiene un juego de favoritos
  * @returns Promise
  */
  leeJuegosFavoritos() {
    return this.myFavs.get();
  }

  /**
  * Método para obtener un juego de favoritos.
  * @param id Es el id del juego necesario para obtener un juego de favoritos.
  * @returns Observable
  */
  leeJuegoFavorito(id) {
    return this.myFavs.doc(id).get();
  }

  /**
  * Método para obtener tus juegos de la base de datos.
  * @returns Promise
  */
  leeJuegos() {
    return this.myCollection.get();
  }

  /**
   * Método para recoger un juego de la base de datos
   * @param id 
   * @returns Observable
   */
  leeJuego(id) {
    return this.myCollection.doc(id).get();
  }

  /**
   * Método para actualizar un juego de la base de datos
   * @param id 
   * @param data 
   * @returns Observable
   */
  actualizaJuego(id, data) {
    return this.myCollection.doc(id).set(data);
  }
  
  /**
   * Método para borrar un juego de la base de datos
   * @param id 
   * @returns Observable
   */
  borraJuego(id) {
    return this.myCollection.doc(id).delete();
  }

}
