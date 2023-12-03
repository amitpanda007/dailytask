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
import {
  Subscription,
  combineLatest,
  combineLatestWith,
  concatAll,
  mergeAll,
  of,
} from 'rxjs';
import { cloneDeep } from 'lodash';
import { TaskService } from 'src/app/core/services/task.service';
import {
  ScheduleDialogComponent,
  ScheduleDialogResult,
} from 'src/app/common/schedule-dialog/schedule-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'src/app/core/services/common.service';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogResult,
} from 'src/app/common/confirmation-dialog/confirmation-dialog.component';
import {
  CalendarDialogComponent,
  CalendarDialogResult,
} from 'src/app/common/calendar-dialog/calendar-dialog.component';
import {
  Label,
  LabelDialogComponent,
  LabelDialogResult,
} from 'src/app/common/label-dialog/label-dialog.component';

@Component({
  selector: 'task',
  templateUrl: 'task.component.html',
  styleUrls: ['task.component.scss'],
})
export class TaskComponent implements OnInit {
  taskId!: string;
  taskText: string = '';
  percentage: string = '50, 100';
  selectedTheme!: string;
  disabledTheme!: string;
  selectedDate!: Date | null;
  isShowingCalender: boolean = false;
  isDateChanged: boolean = false;
  showInputField: boolean = false;
  percentageComplete: number = 0;
  private paramSubscription!: Subscription;
  labels: Label[] = [];

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
  // permanentTasks: Task[] = [];

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
      this.disabledTheme = '#969696';
    } else {
      this.selectedTheme = '#fe387b';
      this.disabledTheme = '#969696';
    }

    this.paramSubscription = this.route.paramMap.subscribe(
      (params: ParamMap) => {
        this.taskId = params.get('taskId') as string;
      }
    );

    const today = new Date();
    this.taskService.getTasksByDate(today);
    this.taskService.tasksChanged.subscribe((tasks: Task[]) => {
      console.log(tasks);
      tasks.sort(this.compare);
      this.tasks = tasks;
      this.calculatePercentage();
      this.addLabelToTask();
    });

    // this.taskService.getPermanentTasks();
    // this.taskService.permanentTasksChanged.subscribe(
    //   (permanentTasks: Task[]) => {
    //     console.log(permanentTasks);
    //     permanentTasks.sort(this.compare);
    //     this.permanentTasks = permanentTasks;
    //     // this.calculatePercentage();
    //   }
    // );

    this.taskService.getLabels();
    this.taskService.labelsChanged.subscribe((labels) => {
      console.log(labels);
      this.labels = labels;
      this.addLabelToTask();
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

  addLabelToTask() {
    this.tasks.forEach((task) => {
      task.labels = [];
      task.labelIds?.forEach((id) => {
        let labelFound = this.labels.find((lbl) => lbl.id == id);
        if (labelFound) task.labels.push(labelFound);
      });
    });
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
        labels: [],
        labelIds: [],
        isPermanent: false
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

  changeStatus(task: Task, taskType: string) {
    task.status = !task.status;
    task.modified = new Date();
    this.taskService.updateTask(task, taskType);
    this.calculatePercentage();
  }

  focusBoardTitle(task: Task) {
    task.backupText = cloneDeep(task.text);
  }

  focusOutBoardTitle(task: Task, taskType: string) {
    if (task.backupText !== task.text) {
      delete task.backupText;
      task.modified = new Date();
      this.taskService.updateTask(task, taskType);
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
      this.taskService.removeTaskSubscription();
      this.taskService.getTasksByDate(date);
    } else {
      this.isDateChanged = true;
      this.taskService.removeTaskSubscription();
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

  deleteSchedule(task: Task) {
    delete task.start;
    delete task.end;
    this.taskService.deleteSchedule(task);
  }

  addLabel(task: Task, taskType: string) {
    console.log(task);
    const clonedTask = JSON.parse(JSON.stringify(task));

    const dialogRef = this.dialog.open(LabelDialogComponent, {
      width: '360px',
      data: {
        themeColor: this.selectedTheme,
        task: clonedTask,
      },
    });

    dialogRef.afterClosed().subscribe((result: LabelDialogResult) => {
      console.log(result);
      if (!result) {
        return;
      }

      if (result.updatedTask != undefined) {
        // task.labels = result.updatedTask.labels;
        task.labelIds = result.updatedTask.labelIds;
        this.taskService.updateTask(task, taskType);
      }
    });
  }

  scheduleTask(task: Task, taskType: string) {
    console.log(task);
    console.log(this.createBoardRef);

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
      this.taskService.updateTask(task, taskType);
    });
  }

  moveTaskForToday(task: Task, taskType: string) {
    console.log(task);

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '270px',
      height: '210px',
    });

    dialogRef.afterClosed().subscribe((result: ConfirmationDialogResult) => {
      console.log(result);
      if (!result) {
        return;
      }

      // Logic for moving task to Tomorrow
      if (result.confirm) {
        const today = new Date();
        task.created = today;
        task.modified = today;
        this.taskService.updateTask(task, taskType);
      }
    });
  }

  moveTaskForTomorrow(task: Task, taskType: string) {
    console.log(task);

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '270px',
      height: '210px',
    });

    dialogRef.afterClosed().subscribe((result: ConfirmationDialogResult) => {
      console.log(result);
      if (!result) {
        return;
      }

      // Logic for moving task to Tomorrow
      if (result.confirm) {
        const tomorrow = this.getNextDay();
        task.created = tomorrow;
        task.modified = tomorrow;
        this.taskService.updateTask(task, taskType);
      }
    });
  }

  moveTaskToDate(task: Task, taskType: string) {
    console.log(task);

    const dialogRef = this.dialog.open(CalendarDialogComponent, {
      width: '280px',
      height: '500px',
    });

    dialogRef.afterClosed().subscribe((result: CalendarDialogResult) => {
      console.log(result);
      if (!result) {
        return;
      }

      if (result.date) {
        task.created = result.date;
        task.modified = result.date;
        this.taskService.updateTask(task, taskType);
      }
    });
  }

  // convertToPermanentTask(task: Task) {
  //   console.log(task);

  //   const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
  //     width: '270px',
  //     height: '210px',
  //   });

  //   dialogRef.afterClosed().subscribe((result: ConfirmationDialogResult) => {
  //     console.log(result);
  //     if (!result) {
  //       return;
  //     }

  //     // Logic for moving task to long term
  //     if (result.confirm) {
  //       this.taskService.moveTaskToLongRun(task);
  //     }
  //   });
  // }

  getNextDay(): Date {
    const today = new Date();
    var tomorrow = new Date(today.getTime() + 86400000);
    const nextDay = new Date(
      `${
        tomorrow.getMonth() + 1
      }/${tomorrow.getDate()}/${tomorrow.getFullYear()} 12:01:00`
    );
    return nextDay;
  }

  editTask(task: Task) {
    task.isEdit = !task.isEdit;
    if (task.isEdit) {
      task.backupText = cloneDeep(task.text);
    }
    if (!task.isEdit && task.backupText !== task.text) {
      delete task.backupText;
      task.modified = new Date();
      this.taskService.updateTask(task, 'DAILY');
      return;
    }
  }

  markTaskPermanent(task: Task) {
    task.isPermanent = !task.isPermanent;
    this.taskService.updateTask(task, 'DAILY');
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
  labels: Label[];
  labelIds?: string[];
  isEdit?: boolean;
  isPermanent: boolean;
}

export enum TaskType {
  DAILY,
  PERMANENT,
}
