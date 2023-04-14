import { Component, ElementRef, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogConfig,
} from '@angular/material/dialog';

@Component({
  selector: 'app-calendar-dialog',
  templateUrl: './calendar-dialog.component.html',
  styleUrls: ['./calendar-dialog.component.scss'],
})
export class CalendarDialogComponent implements OnInit {
  selectedDate!: Date | null;

  constructor(
    public dialogRef: MatDialogRef<CalendarDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CalendarDialogData
  ) {}

  ngOnInit(): void {}

  calenderFilter = (d: Date): boolean => {
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

  cancel(): void {
    this.dialogRef.close({ date: undefined });
  }

  save() {
    let date: any = this.selectedDate;
    date = new Date(date?.setTime(date?.getTime() + 1000 * 60));
    this.dialogRef.close({ date: date });
  }
}

export interface CalendarDialogData {}

export interface CalendarDialogResult {
  date: Date;
}
