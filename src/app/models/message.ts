/*
Aqui se establecen los atributos del mensaje que se envía al foro.
Se va a necesitar para poder guardar los atributos del mensaje
en el array de mensaje que tendrá cada foro.
*/
export interface message{
    content : string
    type : string
    date : Date
    img : string
    autor: string
}