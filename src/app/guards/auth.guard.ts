import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";
import { map } from "rxjs/operators";
import { isNullOrUndefined } from 'util';

@Injectable({
  providedIn: 'root'
})
/**
 * Clase que comprueba si hay algún usuario con la sesión iniciada, en ese caso la aplicación
 * se abrirá con la sesión del último usuario desde la pantalla de los juegos.
 */
export class AuthGuard implements CanActivate {
  constructor(private AFauth : AngularFireAuth,
    private router: Router){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

      return this.AFauth.authState.pipe(map( auth => {

        if(isNullOrUndefined(auth)){
          this.router.navigate(['/login']);
          return false
        }else{
          return true
        }
        // console.log(auth);
        // return false;
      }))

  
  }
}
