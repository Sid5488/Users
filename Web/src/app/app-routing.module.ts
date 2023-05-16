import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './views/login/login.component';
import { AuthenticatedGuard } from './shared/auth/authenticated.guard';
import { HomeComponent } from './views/home/home.component';
import { UpdateComponent } from './shared/components/update/update.component';
import { DeleteComponent } from './shared/components/delete/delete.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthenticatedGuard]
  },
  {
    path: 'update/:id',
    component: UpdateComponent,
    canActivate: [AuthenticatedGuard]
  },
  {
    path: 'delete/:id',
    component: DeleteComponent,
    canActivate: [AuthenticatedGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
