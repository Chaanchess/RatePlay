import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { environment } from '../../environments/environment';
import { firestore } from 'firebase';
import { juego } from "../models/juego";

@Injectable({
  providedIn: 'root'
})
/**
 * Servicio que se encargar de realizar todas las operaciones necesarias relacionadas con la base de datos de firebase.
 */
export class TodoservicioService {
  myCollection: any;
  users: any;
  queue = [];
  isConnected = true;
  ultimoJuegoCargado = null;  //último usuario cargado
  endUltimoJuegoCargado = null;  //último cargado esta vez, si es igual al anterior, entonces no hay más que cargar
  infiniteGameEn = true;  //está el infiniteScroll habilitado porque se haya cumplido lo anterior

/*Variables para el infiniteScroll de la pestaña ranking*/
  infiniteGameCargado = null;
  infiniteEndGameCargado = null;
  infiniteScrollGameActivado = true;
  constructor(private fireStore: AngularFirestore) {
    /**
     * Crea una referencia a la colección 'todo' que empleamos para realizar las operaciones CRUD
     */
    this.myCollection = fireStore.collection<any>(environment.firebaseConfig.juegoColeccion);
    this.users = fireStore.collection<any>(environment.firebaseConfig.users);
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
   * Método que agrega un usuario a la base de datos
   * @param userdId El id del usuario
   * @param datos Los datos del usuario
   * @returns Promise
   */
  agregaUsuario(userdId, datos) {
    return this.users.doc(userdId).set({
      datos
    }, { merge: true });
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
   * Método para borrar un juego de la base de datos
   * @param id 
   * @returns Observable
   */
  borraJuego(id) {
    return this.myCollection.doc(id).delete();
  }

  /**
  * Método para obtener un usuario en concreto de la base de datos.
  * @param uid Es el id unico del usuario
  * @returns Promise
  */
  getUserbyId(uid) {
    return this.users.doc(uid).valueChanges();
  }

  /**
 * Método para obtener agregar un juego a la lista de favoritos del usuario
 * @param juego Es el juego con sus correspondientes datos que se le asigna al usuario
 * @param uid Es el id unico del usuario
 * @returns Promise
 */
  agregaJuegoFavorito(juego: juego, uid) {

    this.users.doc(uid).update({
      juegos: firestore.FieldValue.arrayUnion(juego),
    })
  }

  /**
  * Método para eliminar un juego de la lista de favoritos del usuario
  * @param juego Es el juego con sus correspondientes datos
  * @param uid Es el id unico del usuario
  * @returns Promise
  */
  deleteJuegoFavoritos(juego, uid) {
    this.users.doc(uid).update({
      juegos: firestore.FieldValue.arrayRemove(juego)
    })
  }

   /**
  * Método para obtener todos los juegos de la base de datos.
  *  Si recibe una variable event es se ejecuta el refresher o el infinite scroll, en caso negativo,
  * significaria que se llama desde el onInit de la pantalla
  * @returns Promise
  */
  getGames(reload?): Promise<juego[]> {
    if (reload) {
      this.infiniteEndGameCargado = null;
      this.infiniteScrollGameActivado = true;
    }
    this.infiniteGameCargado = this.infiniteEndGameCargado;
    return new Promise((resolve, reject) => {
      let lreq: juego[] = [];
      let query;
      if (this.infiniteGameCargado == null) {
        query = this.myCollection.ref.orderBy("title", "desc").limit(3).get();
      } else {
        query = this.myCollection.ref.orderBy("title", "desc").startAfter(this.infiniteGameCargado).limit(3).get();
      }
      query.then((d) => {
        d.forEach((u) => {
          let x = { id: u.id, ...u.data() };
          lreq.push(x);
        });
        this.infiniteEndGameCargado = d.docs[d.docs.length - 1];
        if (d.docs.length < 3) {
          this.infiniteScrollGameActivado = false;
        }
        resolve(lreq);
      })
    })
  }

   /**
  * Método que comprueba el estado del infinite scroll
  */
   infiniteScrollActivado() {
    return this.infiniteScrollGameActivado;
  }
}
