import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { TasksModule } from '../tasks/tasks.module';
import { DiaryRoutingModule } from './diary.routing.module';
import { DiaryComponent } from './diary/diary.component';

@NgModule({
  imports: [SharedModule, DiaryRoutingModule, TasksModule],
  declarations: [DiaryRoutingModule.components],
  exports: [],
})
export class DiaryModule {}
