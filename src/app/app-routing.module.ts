import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './core/home/home.component';
import { TaskListComponent } from './tasks/task-list/task.list.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  // {
  //   path: 'tasks',
  //   loadChildren: () =>
  //     import('./tasks/tasks.module').then((m) => m.TasksModule),
  // },
  // {
  //   path: 'diary',
  //   loadChildren: () =>
  //     import('./diary/diary.module').then((m) => m.DiaryModule),
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
