import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { iProps } from '../model/iProps';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

/*
Es un servicio autenticación.
Empleamos una base de datos local donde guardamos datos como el 
el idioma y el tema elegido. En caso de que existan esas variables
en la base de datos local se cargan y el usuario verá el idioma y
tema que haya elegido al final.
*/
export class AuthenticationService {
  props: iProps = {};

  constructor(private storage: Storage,
    public httpClient: HttpClient) {
    this.props.lang = environment.defaultLanguage;
    this.props.skin = environment.defaultSkin;
  }

   /*Carga las variables de la base de datos local*/
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

   /*Obtener el lenguaje guardado en la base de datos local.*/
  getLang() {
    return this.props.lang;
  }

  /*Obtener el tema guardado en la base de datos local.*/
  getSkin() {
    return this.props.skin;
  }

  /*Obtener todos los datos guardados en la base de datos local.*/
  getProps() {
    return this.props;
  }

  /*Establecer todos los datos guardados en la base de datos local.*/
  setProps(props: iProps) {
    this.props = props;
    return this.storage.set("props", this.props)
  }

  /*Establecer el tema en la base de datos local.*/
  setSkin(val) {
    this.props.skin = val;
    return this.storage.set("props", this.props);
  }

  /*Establecer el lenguaje en la base de datos local.*/
  setLang(val) {
    this.props.lang = val;
    return this.storage.set("props", this.props);
  }
}
