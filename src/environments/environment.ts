// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig : {
    apiKey: "AIzaSyDRnDRhuUF6B8gH_ljGZwmsqOrpI-7O-NU",
    authDomain: "rateandplay-f331a.firebaseapp.com",
    databaseURL: "https://rateandplay-f331a.firebaseio.com",
    projectId: "rateandplay-f331a",
    storageBucket: "rateandplay-f331a.appspot.com",
    messagingSenderId: "599203522218",
    juegoColeccion: "juego",
    favoritosColeccion:"favoritos",
    chatsColeccion:"chatsRomms",
    users:"users"
  },
  currentLanguages:['es','en'], //idiomas disponibles de la aplicación
  defaultLanguage:"es",
  defaultSkin:"light",
  autoScroll:"no"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
