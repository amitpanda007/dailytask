import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { cloneDeep } from 'lodash';
import { Subscription } from 'rxjs';
import {
  ScheduleDialogComponent,
  ScheduleDialogResult,
} from 'src/app/common/schedule-dialog/schedule-dialog.component';
import { CommonService } from 'src/app/core/services/common.service';
import { DiaryService } from 'src/app/core/services/diary.service';

@Component({
  selector: 'diary',
  templateUrl: 'diary.component.html',
  styleUrls: ['diary.component.scss'],
})
export class DiaryComponent implements OnInit {
  taskId!: string;
  selectedTheme!: string;
  enableTheme: boolean = true;
  private paramSubscription!: Subscription;

  @ViewChild('workScheduleElm', { static: false })
  public createBoardRef!: ElementRef;

  workText: string = '';
  works: Work[] = [];

  familyText: string = '';
  families: Family[] = [];

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private diaryService: DiaryService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    const theme = localStorage.getItem('diaryThemeColor');
    if (theme) {
      this.selectedTheme = theme;
    } else {
      this.selectedTheme = '#fe387b';
    }

    this.paramSubscription = this.route.paramMap.subscribe(
      (params: ParamMap) => {
        this.taskId = params.get('diaryId') as string;
      }
    );
  }

  ngOnDestroy() {
    this.paramSubscription.unsubscribe();
  }

  selectTheme(theme: string) {
    this.selectedTheme = theme;
    localStorage.setItem('diaryThemeColor', this.selectedTheme);
    this.toggleTheme();
  }

  toggleTheme() {
    this.enableTheme = !this.enableTheme;
  }

  onWorkEnter() {
    if (this.workText && this.workText.trim().length > 0) {
      const workData: Work = {
        id: this.commonService.randomId(10),
        text: this.workText,
        status: false,
        created: new Date(),
        modified: new Date(),
      };
      this.works.push(workData);
      this.workText = '';
      // this.diaryService.updateDiary(workData);
    }
  }

  changeWorkStatus(work: Work) {
    console.log(work);
    work.status = !work.status;
  }

  focusBoardTitle(work: Work) {
    work.backupWorkText = cloneDeep(work.text);
  }

  focusOutBoardTitle(work: Work) {
    if (work.backupWorkText !== work.text) {
      delete work.backupWorkText;
      work.modified = new Date();
      // this.diaryService.updateDiary(work);
    }
  }

  scheduleTask(work: Work) {
    console.log(work);

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

      if (result.start) work.start = result.start;
      if (result.end) work.end = result.end;
      // this.diaryService.updateTask(work);
    });
  }

  deleteWork(work: Work) {
    this.works.splice(this.works.findIndex((w) => w.id === work.id));
    console.log(this.works);
    // this.diaryService.deleteWork(work);
  }

  onFamilyEnter() {
    if (this.familyText && this.familyText.trim().length > 0) {
      const familyData: Family = {
        id: this.commonService.randomId(10),
        text: this.familyText,
        status: false,
        created: new Date(),
        modified: new Date(),
      };
      this.families.push(familyData);
      this.familyText = '';
      // this.diaryService.updateDiary(workData);
    }
  }

  changeFamilyStatus(family: Family) {
    console.log(family);
    family.status = !family.status;
    // this.diaryService.updateDiary(family);
  }

  focusFamilyTitle(family: Family) {
    family.backupFamilyText = cloneDeep(family.text);
  }

  focusOutFamilyTitle(family: Family) {
    if (family.backupFamilyText !== family.text) {
      delete family.backupFamilyText;
      family.modified = new Date();
      // this.diaryService.updateDiary(family);
    }
  }

  scheduleFamilyTask(family: Family) {
    console.log(family);

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

      if (result.start) family.start = result.start;
      if (result.end) family.end = result.end;
      // this.diaryService.updateDiary(family);
    });
  }

  deleteFamily(family: Family) {
    this.families.splice(this.families.findIndex((w) => w.id === family.id));
    console.log(this.families);
    // this.diaryService.deleteWork(work);
  }
}

export interface Diary {
  id?: string;
  work?: Work[];
  family?: Family[];
  selfcare?: SelfCare[];
  suggestion?: Suggestion[];
  notes?: Notes[];
  ratings?: Ratings;
  created: Date;
  modified: Date;
}

export interface Work {
  id: string;
  text: string;
  backupWorkText?: string;
  status: boolean;
  start?: string;
  end?: string;
  created: Date;
  modified: Date;
}
export interface Family {
  id: string;
  text: string;
  backupFamilyText?: string;
  status: boolean;
  start?: string;
  end?: string;
  created: Date;
  modified: Date;
}
export interface SelfCare {
  id: string;
  text: string;
  status: boolean;
  start?: string;
  end?: string;
  created: Date;
  modified: Date;
}
export interface Suggestion {
  id: string;
  text: string;
  created: Date;
  modified: Date;
}
export interface Notes {
  id: string;
  text: string;
  created: Date;
  modified: Date;
}
export interface Ratings {
  id: string;
  text: string;
  created: Date;
  modified: Date;
}
