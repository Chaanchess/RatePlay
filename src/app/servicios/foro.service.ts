import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from "rxjs/operators";
import { message } from "../models/message";
import { firestore } from 'firebase';

export interface foro {
  description : string
  name : string
  id: string
  img : string
}

@Injectable({
  providedIn: 'root'
})
/**
 * Servicio que se encargar de realizar todas las operaciones necesarias relacionadas con los foros guardados en nuestra base de datos
 */
export class ForoService {

  constructor(private db: AngularFirestore) { }

  /**
 * Método que se encargar de recoger los foros que hay guardados en la coleccion
 * chatsRooms en la base de datos
 * @returns Observable
 */
  getChatRooms(){
    
    return this.db.collection('chatsRooms').snapshotChanges().pipe(map(rooms => {
      return rooms.map(a =>{
        const data = a.payload.doc.data() as foro;
        data.id = a.payload.doc.id;
        return data;
      })
    }))
  }

  /**
 * Método que se encargar de recoger un solo foro de la base de datos
 * @returns Promise
 */
  getChatRoom( foro_id : string){
    return this.db.collection('chatsRooms').doc(foro_id).valueChanges()   ///añadir where para limitar en un tiempo
  }

  /**
 * Método que se encargar de enviar un mensaje al array de mensajes del foro
 * seleccionado
 * @param message Es el mensaje que se va a enviar con todos sus datos.
 * @param foro_id Es el id del foro
 */
  sendMsgToFirebase( message : message, foro_id : string){

    this.db.collection('chatsRooms').doc(foro_id).update({
      messages : firestore.FieldValue.arrayUnion(message),
    })
  }
}
