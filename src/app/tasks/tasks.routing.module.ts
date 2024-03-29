import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskComponent } from './task/task.component';
import {
  AngularFireAuthGuard,
  redirectUnauthorizedTo,
  redirectLoggedInTo,
} from '@angular/fire/compat/auth-guard';
import { ColorIconComponent } from './task/color.icon.component';
import { ColorIconListComponent } from './task/color.icon.list.component';
import { TaskOptionsComponent } from './task-options/task.options.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToTasks = () => redirectLoggedInTo(['tasks']);

const routes: Routes = [
  {
    path: 'tasks',
    component: TaskComponent,
    canActivate: [AngularFireAuthGuard],
    data: {
      authGuardPipe: redirectUnauthorizedToLogin,
    },
  },
  {
    path: 'tasks/:taskId',
    component: TaskComponent,
    canActivate: [AngularFireAuthGuard],
    data: {
      authGuardPipe: redirectUnauthorizedToLogin,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TasksRoutingModule {
  static components = [
    TaskOptionsComponent,
    TaskComponent,
    ColorIconComponent,
    ColorIconListComponent,
  ];
}
