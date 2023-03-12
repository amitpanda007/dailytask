import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ColorIconComponent } from './task/color.icon.component';
import { ColorIconListComponent } from './task/color.icon.list.component';
import { TasksRoutingModule } from './tasks.routing.module';

@NgModule({
  imports: [SharedModule, DragDropModule, TasksRoutingModule],
  declarations: [TasksRoutingModule.components],
  exports: [ColorIconComponent, ColorIconListComponent],
})
export class TasksModule {}
