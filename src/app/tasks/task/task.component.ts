import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Subscription } from 'rxjs';
import { cloneDeep } from 'lodash';
import { TaskService } from 'src/app/core/services/task.service';
import { MatCalendar } from '@angular/material/datepicker';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'task',
  templateUrl: 'task.component.html',
  styleUrls: ['task.component.scss'],
})
export class TaskComponent implements OnInit {
  taskId!: string;
  taskText: string = '';
  enableTheme: boolean = true;
  percentage: string = '50, 100';
  selectedTheme!: string;
  selectedDate!: Date | null;
  isShowingCalender: boolean = false;
  isDateChanged: boolean = false;
  private paramSubscription!: Subscription;

  myHolidayFilter = (d: Date): boolean => {
    const today = new Date();
    return !(
      new Date(
        today.getFullYear() +
          '-' +
          (today.getMonth() + 1) +
          '-' +
          today.getDate()
      ).getTime() < d.getTime()
    );
  };

  // selectedTheme = this.themeColors.red2;

  tasks: Task[] = [];

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    const theme = localStorage.getItem('themeColor');
    if (theme) {
      this.selectedTheme = theme;
    } else {
      this.selectedTheme = '#fe387b';
    }

    this.paramSubscription = this.route.paramMap.subscribe(
      (params: ParamMap) => {
        this.taskId = params.get('taskId') as string;
        console.log(this.taskId);
      }
    );

    const today = new Date();
    this.taskService.getTasksByDate(today);
    this.taskService.tasksChanged.subscribe((tasks: Task[]) => {
      console.log(tasks);
      tasks.sort(this.compare);
      this.tasks = tasks;
    });
  }

  ngOnDestroy() {
    this.paramSubscription.unsubscribe();
  }

  compare(a: any, b: any) {
    if (a.rank < b.rank) {
      return -1;
    }
    if (a.rank > b.rank) {
      return 1;
    }
    return 0;
  }

  onEnter() {
    if (this.taskText && this.taskText.trim().length > 0) {
      console.log(this.taskText);
      const rank = this.tasks.length;
      const taskData: Task = {
        taskId: this.randomId(10),
        text: this.taskText,
        status: false,
        created: new Date(),
        modified: new Date(),
        rank: rank,
      };
      this.tasks.push(taskData);
      this.taskText = '';
      this.taskService.addTask(taskData);
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    const changedTasks: Task[] = [];
    const taskCopy = cloneDeep(this.tasks);
    moveItemInArray(this.tasks, event.previousIndex, event.currentIndex);
    taskCopy.forEach((tsk, i) => {
      this.tasks.forEach((tsk1, j) => {
        if (tsk.id == tsk1.id && i != j) {
          const task = tsk;
          task.rank = j;
          changedTasks.push(task);
        }
      });
    });
    console.log(changedTasks);
    this.taskService.updateTaskSequence(changedTasks);
  }

  changeStatus(task: Task) {
    task.status = !task.status;
    task.modified = new Date();
    this.taskService.updateTask(task);
  }

  randomId(length: number) {
    const chars =
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = length; i > 0; --i)
      result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }

  selectTheme(theme: string) {
    this.selectedTheme = theme;
    localStorage.setItem('themeColor', this.selectedTheme);
    this.toggleTheme();
  }

  toggleTheme() {
    this.enableTheme = !this.enableTheme;
  }

  focusBoardTitle(task: Task) {
    console.log('Focus ON');
    task.backupText = cloneDeep(task.text);
  }

  focusOutBoardTitle(task: Task) {
    console.log(`Focus OUT`);
    if (task.backupText !== task.text) {
      console.log('Text Changed');
      delete task.backupText;
      task.modified = new Date();
      this.taskService.updateTask(task);
    }
  }

  dateChanged(date: any) {
    this.selectedDate = date;
    const today = new Date();
    if (
      today.getDate() == date.getDate() &&
      today.getMonth() == date.getMonth() &&
      today.getFullYear() == date.getFullYear()
    ) {
      this.isDateChanged = false;
      this.taskService.getTasksByDate(date);
    } else {
      this.isDateChanged = true;
      this.taskService.getTasksByDate(date);
    }
    this.isShowingCalender = false;
  }

  showCalender() {
    this.isShowingCalender = true;
  }

  closeCalender() {
    this.isShowingCalender = false;
  }

  deleteTask(task: Task) {
    this.taskService.deleteTask(task);
  }
}

export interface Task {
  id?: string;
  taskId: string;
  text: string;
  backupText?: string;
  status: boolean;
  created: Date;
  modified: Date;
  rank: number;
}
