import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from "@angular/router";
import { map } from "rxjs/operators";

import { AngularFireAuth } from "@angular/fire/auth";
import { isNullOrUndefined } from 'util';

@Injectable({
  providedIn: 'root'
})
/**
 * Clase que comprueba que no hay ninguna sesión iniciada en la aplicación. En ese caso
 * se navegará a la pantalla principal, es decir, el inicio de sesión o el registro de usuario.
 */
export class NoLoginGuard implements CanActivate {
  constructor(private router : Router,
    private AFauth : AngularFireAuth){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
   
      return this.AFauth.authState.pipe(map(auth => {

        if(isNullOrUndefined(auth)){
         
         return true;
        }else{
         this.router.navigate(['/home']);
          return false;
        }
 
       }))

  }
}
