import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from "./guards/auth.guard";
import { NoLoginGuard } from "./guards/no-login.guard";

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule', canActivate : [AuthGuard] },
  { path: 'modal', loadChildren: './modal/modal.module#ModalPageModule', canActivate : [AuthGuard] },
  { path: 'acercade', loadChildren: './acercade/acercade.module#AcercadePageModule', canActivate : [AuthGuard] },
  { path: 'modal-fav', loadChildren: './modal-fav/modal-fav.module#ModalFavPageModule', canActivate : [AuthGuard] },
  { path: 'login', loadChildren: './componentes/login/login.module#LoginPageModule',canActivate : [NoLoginGuard] },
  { path: 'registro', loadChildren: './componentes/registro/registro.module#RegistroPageModule',canActivate : [NoLoginGuard] }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
