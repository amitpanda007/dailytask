import { Component, ElementRef, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogConfig,
} from '@angular/material/dialog';

@Component({
  selector: 'app-schedule-dialog',
  templateUrl: './schedule-dialog.component.html',
  styleUrls: ['./schedule-dialog.component.scss'],
})
export class ScheduleDialogComponent implements OnInit {
  private positionRelativeToElement: ElementRef =
    this.data.positionRelativeToElement;

  startSelectedHour!: string;
  startSelectedMin!: string;
  startTime!: string;
  endSelectedHour!: string;
  endSelectedMin!: string;
  endTime!: string;

  hours = [
    { value: '1', viewValue: '1' },
    { value: '2', viewValue: '2' },
    { value: '3', viewValue: '3' },
    { value: '4', viewValue: '4' },
    { value: '5', viewValue: '5' },
    { value: '6', viewValue: '6' },
    { value: '7', viewValue: '7' },
    { value: '8', viewValue: '8' },
    { value: '9', viewValue: '9' },
    { value: '10', viewValue: '10' },
    { value: '11', viewValue: '11' },
    { value: '12', viewValue: '12' },
  ];

  mins = [
    { value: '15', viewValue: '15' },
    { value: '30', viewValue: '30' },
    { value: '45', viewValue: '45' },
  ];

  constructor(
    public dialogRef: MatDialogRef<ScheduleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ScheduleDialogData
  ) {
    console.log(data);
  }

  ngOnInit(): void {
    const matDialogConfig = new MatDialogConfig();
    const rect: DOMRect =
      this.positionRelativeToElement.nativeElement.getBoundingClientRect();

    console.log(rect);

    if (rect.right > window.innerWidth - 270) {
      matDialogConfig.position = {
        top: `${rect.top - 50}px`,
        left: `${rect.left - 250}px`,
      };
    } else {
      matDialogConfig.position = {
        top: `${rect.top - 50}px`,
        left: `${rect.left - 50}px`,
      };
    }
    // this.dialogRef.updatePosition(matDialogConfig.position);
  }

  cancel(): void {
    this.dialogRef.close();
  }

  save() {
    let startDate = '';
    let endDate = '';
    if (this.startSelectedHour && this.startTime) {
      startDate = this.startSelectedHour + ' ' + this.startTime;
      if (this.startSelectedMin) {
        startDate =
          this.startSelectedHour +
          ':' +
          this.startSelectedMin +
          ' ' +
          this.startTime;
      }
    }

    if (this.endSelectedHour && this.endTime) {
      endDate = this.endSelectedHour + ' ' + this.endTime;
      if (this.endSelectedMin) {
        endDate =
          this.endSelectedHour + ':' + this.endSelectedMin + ' ' + this.endTime;
      }
    }

    this.dialogRef.close({
      start: startDate,
      end: endDate,
    });
  }
}

export interface ScheduleDialogData {
  positionRelativeToElement: ElementRef;
}

export interface ScheduleDialogResult {
  start?: string;
  end?: string;
}
