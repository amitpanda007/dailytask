import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Subscription } from 'rxjs';
import { cloneDeep } from 'lodash';
import { TaskService } from 'src/app/core/services/task.service';
import {
  ScheduleDialogComponent,
  ScheduleDialogResult,
} from 'src/app/common/schedule-dialog/schedule-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'src/app/core/services/common.service';

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
  showInputField: boolean = false;
  percentageComplete: number = 0;
  private paramSubscription!: Subscription;

  @ViewChild('createBoardElm', { static: false })
  public createBoardRef!: ElementRef;

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

  tasks: Task[] = [];

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private taskService: TaskService,
    private commonService: CommonService
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
      }
    );

    const today = new Date();
    this.taskService.getTasksByDate(today);
    this.taskService.tasksChanged.subscribe((tasks: Task[]) => {
      tasks.sort(this.compare);
      this.tasks = tasks;
      this.calculatePercentage();
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

  calculatePercentage() {
    const total = this.tasks.length;
    if (total == 0) {
      this.percentageComplete = 0;
      return;
    }
    const completedTasks = this.tasks.filter((task) => task.status).length;
    this.percentageComplete = Math.floor((completedTasks / total) * 100);
  }

  onEnter() {
    if (this.taskText && this.taskText.trim().length > 0) {
      const rank = this.tasks.length;
      const taskData: Task = {
        taskId: this.commonService.randomId(10),
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

  onKeyDown(event: any) {
    if (event.ctrlKey && event.key === 'b') {
      console.log('BOLD TEXT');
    }
  }

  selectionchange(ev: any) {
    console.log(ev);
    const start = ev.target.selectionStart;
    const end = ev.target.selectionEnd;
    console.log(ev.target.value.substr(start, end - start));
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
    this.taskService.updateTaskSequence(changedTasks);
  }

  changeStatus(task: Task) {
    task.status = !task.status;
    task.modified = new Date();
    this.taskService.updateTask(task);
    this.calculatePercentage();
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
    task.backupText = cloneDeep(task.text);
  }

  focusOutBoardTitle(task: Task) {
    if (task.backupText !== task.text) {
      delete task.backupText;
      task.modified = new Date();
      this.taskService.updateTask(task);
    }
    this.showInputField = false;
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

  scheduleTask(task: Task) {
    console.log(task);

    const dialogRef = this.dialog.open(ScheduleDialogComponent, {
      width: '270px',
      height: '210px',
      data: {
        positionRelativeToElement: this.createBoardRef,
      },
    });

    dialogRef.afterClosed().subscribe((result: ScheduleDialogResult) => {
      console.log(result);
      if (!result) {
        return;
      }

      if (result.start) task.start = result.start;
      if (result.end) task.end = result.end;
      this.taskService.updateTask(task);
    });
  }

  enableEdit() {
    this.showInputField = true;
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
  start?: string;
  end?: string;
  rank: number;
}
