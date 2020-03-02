/*
Aqui se establecen los atributos del juego.
Se va a necesitar para poder guardar los atributos del juego
en el array de juegos favoritos que cada usuario tendrá
en la base de datos.
*/
export interface juego{
    id : string
    titulo : string
    descripcion : string
    puntuacion : string
    dificultad : string
    desarrolladora : string
    fechasalida : string
    imagen: string
}