import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  AngularFireAuthGuard,
  redirectUnauthorizedTo,
  redirectLoggedInTo,
} from '@angular/fire/compat/auth-guard';
import { DiaryComponent } from './diary/diary.component';
import { DiaryListComponent } from './diary-list/diary.list.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToTasks = () => redirectLoggedInTo(['tasks']);

const routes: Routes = [
  {
    path: 'diary',
    component: DiaryListComponent,
    canActivate: [AngularFireAuthGuard],
    data: {
      authGuardPipe: redirectUnauthorizedToLogin,
      redirectLoggedInToTasks,
    },
  },
  {
    path: 'diary/:diaryId',
    component: DiaryComponent,
    canActivate: [AngularFireAuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DiaryRoutingModule {
  static components = [DiaryListComponent, DiaryComponent];
}
