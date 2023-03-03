import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Subscription } from 'rxjs';
import { cloneDeep } from 'lodash';
import { TaskService } from 'src/app/core/services/task.service';
import { MatCalendar } from '@angular/material/datepicker';

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

  themeColors = {
    red1: '#fe1045',
    orange1: '#ed5728',
    green1: '#40c19d',
    pink1: '#f86ca6',
    green2: '#25b560',
    blue1: '#5a59ff',
    red2: '#fc0f43',
    blue2: '#609ef2',
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
      this.selectedTheme = this.themeColors.red2;
    }

    this.paramSubscription = this.route.paramMap.subscribe(
      (params: ParamMap) => {
        this.taskId = params.get('taskId') as string;
        console.log(this.taskId);
      }
    );

    this.taskService.getTasks();
    // this.taskService.items.subscribe((tasks: Task[]) => {
    //   console.log(tasks);
    //   this.tasks = tasks;
    // });
    this.taskService.tasksChanged.subscribe((tasks: Task[]) => {
      console.log(tasks);
      this.tasks = tasks;
    });
  }

  ngOnDestroy() {
    this.paramSubscription.unsubscribe();
  }

  onEnter() {
    if (this.taskText && this.taskText.trim().length > 0) {
      console.log(this.taskText);
      const taskData: Task = {
        taskId: this.randomId(10),
        text: this.taskText,
        status: false,
        created: new Date(),
        modified: new Date(),
      };
      this.tasks.push(taskData);
      this.taskText = '';
      this.taskService.addTask(taskData);
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.tasks, event.previousIndex, event.currentIndex);
  }

  changeStatus(task: Task) {
    console.log(task);
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
    switch (theme) {
      case 'red1':
        this.selectedTheme = this.themeColors.red1;
        break;
      case 'orange1':
        this.selectedTheme = this.themeColors.orange1;
        break;
      case 'green1':
        this.selectedTheme = this.themeColors.green1;
        break;
      case 'pink1':
        this.selectedTheme = this.themeColors.pink1;
        break;
      case 'green2':
        this.selectedTheme = this.themeColors.green2;
        break;
      case 'blue1':
        this.selectedTheme = this.themeColors.blue1;
        break;
      case 'red2':
        this.selectedTheme = this.themeColors.red2;
        break;
      case 'blue2':
        this.selectedTheme = this.themeColors.blue2;
        break;
      default:
        this.selectedTheme = this.themeColors.blue2;
    }
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
}
