/*
Aqui se guardan las preferencias del usuario cuando
se cierra la aplicación. En este caso solo se guardan
el lenguaje y el tema que haya escogido. 
*/
export interface iProps{
  user?:string,
  userid?:string,
  lang?:string,
  skin?:string,
  autoScroll?:string
}