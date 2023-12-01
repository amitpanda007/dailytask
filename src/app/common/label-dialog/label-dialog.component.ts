import { Component, ElementRef, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogConfig,
} from '@angular/material/dialog';
import { ColorEvent } from 'ngx-color';
import { TaskService } from 'src/app/core/services/task.service';
import { Task } from 'src/app/tasks/task/task.component';

@Component({
  selector: 'app-label-dialog',
  templateUrl: './label-dialog.component.html',
  styleUrls: ['./label-dialog.component.scss'],
})
export class LabelDialogComponent implements OnInit {
  // private backupLabel: Partial<Label[]> = { ...this.data.labels };
  public labels: Label[] = [];
  public isAddingLabel: boolean = false;
  public isEditingLabel: boolean = false;
  public newLabelId: string = '';
  public newLabelName: string = '';
  public newLabelColor: string = '#272727';
  public newLabelTextColor: string = '#6c757d';
  public selectedLabels: Label[] = [];

  constructor(
    public dialogRef: MatDialogRef<LabelDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LabelDialogData,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    console.log(this.data);

    this.selectedLabels = [];
    this.taskService.labelsChanged.subscribe((labels) => {
      console.log(labels);
      this.labels = labels;
      this.markLabelSelect();
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close({ updatedTask: this.data.task });
  }

  reset() {
    this.newLabelId = '';
    this.newLabelName = '';
    this.newLabelColor = '';
    this.newLabelTextColor = '#000000';
    this.toggleLabel();
    this.toggleEditLabel();
  }

  toggleLabel() {
    this.isAddingLabel = !this.isAddingLabel;
  }

  toggleEditLabel() {
    this.isEditingLabel = !this.isEditingLabel;
  }

  handleChange($event: ColorEvent) {
    console.log($event.color.hex);
    this.newLabelColor = $event.color.hex;
    this.newLabelTextColor = '#FFFFFF';
  }

  async addLabel() {
    const newLabel: Label = {
      name: this.newLabelName,
      color: this.newLabelColor,
      created: new Date(),
      modified: new Date(),
    };

    this.taskService.addLabel(newLabel);
    this.newLabelName = '';
    this.newLabelColor = '';
    this.toggleLabel();
  }

  editLabel(label: Label) {
    console.log('EDIT LABEL');
    this.newLabelId = label.id!;
    this.newLabelName = label.name;
    this.newLabelColor = label.color;
    this.newLabelTextColor = '#FFFFFF';
    this.toggleLabel();
    this.toggleEditLabel();
  }

  updateLabel() {
    const updatedLabel = this.labels.filter(
      (label) => label.id == this.newLabelId
    )[0];
    updatedLabel.color = this.newLabelColor;
    updatedLabel.name = this.newLabelName;
    this.taskService.updateLabel(updatedLabel);
    this.reset();
  }

  deleteLabel(label: Label) {
    console.log('DELETE LABEL');
    this.taskService.deleteLabel(label);
  }

  // selectLabel(label: Label) {
  //   let labelIndex = this.data?.task?.labels?.findIndex(
  //     (l) => l.id == label.id
  //   );
  //   let labelData = this.labels.find((l) => l.id == label.id);

  //   if (labelIndex != undefined && labelIndex > -1) {
  //     this.data?.task?.labels?.splice(labelIndex, 1);
  //     if (labelData != undefined) {
  //       labelData.isSelected = false;
  //     }
  //   } else {
  //     this.data?.task?.labels?.push(label);
  //     if (labelData != undefined) {
  //       labelData.isSelected = true;
  //     }
  //   }
  // }

  selectLabel(label: Label) {
    let labelIndex = this.data?.task?.labelIds?.findIndex(
      (id) => id == label.id
    );
    let labelData = this.labels.find((l) => l.id == label.id);

    if (labelIndex != undefined && labelIndex > -1) {
      this.data?.task?.labelIds?.splice(labelIndex, 1);
      if (labelData != undefined) {
        labelData.isSelected = false;
      }
    } else {
      if (label.id) this.data?.task?.labelIds?.push(label.id);
      if (labelData != undefined) {
        labelData.isSelected = true;
      }
    }
  }

  // markLabelSelect() {
  //   this.labels.forEach((lbl) => {
  //     lbl.isSelected = false;
  //   });

  //   this.data?.task?.labels?.forEach((label) => {
  //     let labelFound = this.labels.find((l) => l.id == label.id);
  //     if (labelFound != undefined) {
  //       labelFound.isSelected = true;
  //     }
  //   });
  // }

  markLabelSelect() {
    this.labels.forEach((lbl) => {
      lbl.isSelected = false;
    });

    this.data?.task?.labelIds?.forEach((id) => {
      let labelFound = this.labels.find((l) => l.id == id);
      if (labelFound != undefined) {
        labelFound.isSelected = true;
      }
    });
  }
}

export interface LabelDialogData {
  enableDelete?: boolean;
  enableEdit?: boolean;
  task?: Task;
  themeColor?: string;
}

export interface LabelDialogResult {
  updatedTask?: Task;
  taskLabelIds?: string[];
}

export interface Label {
  id?: string;
  name: string;
  color: string;
  isSelected?: boolean;
  created: Date;
  modified: Date;
}
