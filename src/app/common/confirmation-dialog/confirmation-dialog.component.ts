import { Component, ElementRef, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogConfig,
} from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
})
export class ConfirmationDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData
  ) {}

  ngOnInit(): void {}

  cancel(): void {
    this.dialogRef.close({ confirm: false });
  }

  save() {
    this.dialogRef.close({ confirm: true });
  }
}

export interface ConfirmationDialogData {}

export interface ConfirmationDialogResult {
  confirm: boolean;
}
