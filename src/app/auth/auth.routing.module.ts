import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import {
  AngularFireAuthGuard,
  redirectUnauthorizedTo,
  redirectLoggedInTo,
} from '@angular/fire/compat/auth-guard';

// const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToTasks = () => redirectLoggedInTo(['tasks']);

const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'register/:emailId', component: RegisterComponent },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      authGuardPipe: redirectLoggedInToTasks,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {
  static components = [RegisterComponent, LoginComponent];
}
