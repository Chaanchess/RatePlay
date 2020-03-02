import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { iProps } from '../model/iProps';
import { of } from 'rxjs';
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";
import { TodoservicioService } from '../servicios/todoservicio.service';

@Injectable({
  providedIn: 'root'
})

/**
 * Es un servicio autenticación.
  Empleamos una base de datos local donde guardamos datos como el 
  el idioma y el tema elegido. En caso de que existan esas variables
  en la base de datos local se cargan y el usuario verá el idioma y
  tema que haya elegido al final.
 */
export class AuthenticationService {
  props: iProps = {};

  constructor(private storage: Storage,
    public httpClient: HttpClient,
    private router: Router,
    private todoServ: TodoservicioService,
    private AFauth: AngularFireAuth) {
    this.props.lang = environment.defaultLanguage;
    this.props.skin = environment.defaultSkin;
  }

  /**
   * Carga las variables de la base de datos local
   * @returns Promise
   */
  initChecking() {
    return new Promise((resolve, reject) => {
      this.storage.get('props').then((val: iProps) => {
        if (val && val != {} && val != "" && val != [] && val != "[]") {
          this.props = val;
        }
        resolve("Props loaded correctly");
      })
        .catch(err => {
          console.log(err);
          reject("Error loading props on local storage");
        });
    });
  }

  /**
   * Obtener el lenguaje guardado en la base de datos local.
   * @returns el lenguaje guardado
   */
  getLang() {
    return this.props.lang;
  }

  /**
   * Obtener el id del último usuario que ha iniciado sesión.
   * @returns el id del usuario
   */
  getUserID() {
    return this.props.userid;
  }

  /**
   * Establecer el id del usuario en la base de datos local.
   * @param val Es el valor del id del usuario
   * @returns el id del usuario
   */
  setUserID(val) {
    this.props.userid = val;
    return this.storage.set("props", this.props);
  }

  /**
   * Obtener el nombre del último usuario que ha iniciado sesión.
   * @returns el nombre del usuario
   */
  getUser() {
    return this.props.user;
  }

  /**
   * Establecer el nombre del usuario en la base de datos local.
   * @param val Es el valor del nombre del usuario
   * @returns el nombre del usuario
   */
  setUser(val) {
    this.props.user = val;
    return this.storage.set("props", this.props);
  }

  /**
   * Obtener el tema guardado en la base de datos local.
   * @returns el tema guardado
   */
  getSkin() {
    return this.props.skin;
  }

  /**
   * Obtener todos los datos guardados en la base de datos local.
   * @returns los datos guardados
   */
  getProps() {
    return this.props;
  }

  /**
   * Establecer todos los datos guardados en la base de datos local.
   * @param props parámetros guardados por el usuario.
   * @returns los parámetros guardados en la base de datos local.
   */
  setProps(props: iProps) {
    this.props = props;
    return this.storage.set("props", this.props)
  }

  /**
   * Establecer el tema en la base de datos local.
   * @param val Es el valor del tema escogido
   * @returns el parámetro del tema guardado
   */
  setSkin(val) {
    this.props.skin = val;
    return this.storage.set("props", this.props);
  }

  /**
   * Establecer el lenguaje en la base de datos local.
   * @param val el valor del lenguaje escogido.
   * @returns el parámetro del lenguaje guardado
   */
  setLang(val) {
    this.props.lang = val;
    return this.storage.set("props", this.props);
  }

  getScroll(){
    return this.props.autoScroll;
  }

  setScroll(val){
    this.props.autoScroll = val;
    return this.storage.set("props", this.props);
  }

  /**
   * Método que se encargar de iniciar sesión en la aplicación. Usa la base de datos de FirebaseAuth.
   * @param email el email del usuario.
   * @param password la contraseña del usuario.
   * @returns Promise
   */
  login(email: string, password: string) {

    return new Promise((resolve, rejected) => {
      this.AFauth.auth.signInWithEmailAndPassword(email, password).then(user => {
        resolve(user);
        this.setUser(email);
        this.setUserID(user.user.uid);
        let data = {
          email: email
        }
        this.todoServ.agregaUsuario(user.user.uid, data);
        console.log("El usuario entrado es " + this.getUser());
        console.log("El id del usuario entrado es:" + user.user.uid);
      }).catch(err => rejected(err));
    });


  }

  /**
   * Método que se encargar de cerrar la sesión del usuario que esté en la aplicación
   * @returns Promise
   */
  logout() {
    return new Promise((resolve, reject) => {
      this.AFauth.auth.signOut().then(() => {
        this.router.navigate(['/login']);
      })
      this.storage.remove('props').then(() => {
        this.initChecking().then(d => {
          resolve();
          navigator['app'].exitApp();
        }).catch(err => {
          reject();
        });
      }).catch(err => {
        console.log("err");
        reject('Error removing props element on local storage');
      });

    });

  }

  /**
   * Método que se encargar de registrar un usuario en la aplicación. Usa la base de datos de FirebaseAuth.
   * @param email el email del usuario.
   * @param password la contraseña del usuario.
   * @returns Promise
   */
  register(email: string, password: string) {
    return new Promise((resolve, rejected) => {
      this.AFauth.auth.createUserWithEmailAndPassword(email, password).then(user => {
        resolve(user);
        console.log(user.user.uid);
        this.setUserID(user.user.uid);
        this.setUser(email);
        let data = {
          email: email
        }
        this.todoServ.agregaUsuario(user.user.uid, data);
      }).catch(err => rejected(err));
    });

  }
}
