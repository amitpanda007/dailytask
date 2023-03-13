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
  isLoading: boolean = true;
  taskId!: string;
  selectedTheme!: string;
  enableTheme: boolean = true;
  private paramSubscription!: Subscription;
  isShowingCalender: boolean = false;
  isDateChanged: boolean = false;
  selectedDate: Date = new Date();

  //Edit input for different sections
  showWorkInputField: boolean = false;
  showFamilyInputField: boolean = false;
  showSelfcareInputField: boolean = false;
  showSuggestionInputField: boolean = false;
  showNotesInputField: boolean = false;

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

  diary: Diary = {};

  @ViewChild('workScheduleElm', { static: false })
  public workScheduleRef!: ElementRef;
  workText: string = '';
  works: Work[] = [];

  @ViewChild('familyScheduleElm', { static: false })
  public familyScheduleRef!: ElementRef;
  familyText: string = '';
  families: Family[] = [];

  @ViewChild('selfcareScheduleElm', { static: false })
  public selfcareScheduleRef!: ElementRef;
  selfcareText: string = '';
  selfcares: SelfCare[] = [];

  @ViewChild('suggestionScheduleElm', { static: false })
  public suggestionScheduleRef!: ElementRef;
  suggestionText: string = '';
  suggestions: Suggestion[] = [];

  // @ViewChild('noteScheduleElm', { static: false })
  // public noteScheduleRef!: ElementRef;
  noteText: string = '';
  notes: Note[] = [];

  workRating: number = 0;
  familyRating: number = 0;
  selfcareRating: number = 0;

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

    const today = new Date();
    this.diaryService.getDiaryByDate(today);
    this.diaryService.diaryChanged.subscribe((diary: Diary) => {
      this.diary = diary;
      this.works = this.diary.work as Work[];
      this.families = this.diary.families as Family[];
      this.selfcares = this.diary.selfcares as SelfCare[];
      this.suggestions = this.diary.suggestions as Suggestion[];
      this.notes = this.diary.notes as Note[];
      this.workRating = this.diary.workRating as number;
      this.familyRating = this.diary.familyRating as number;
      this.selfcareRating = this.diary.selfcareRating as number;
      this.isLoading = false;
    });
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

  dateChanged(date: any) {
    this.selectedDate = date;
    const today = new Date();
    if (
      today.getDate() == date.getDate() &&
      today.getMonth() == date.getMonth() &&
      today.getFullYear() == date.getFullYear()
    ) {
      this.isDateChanged = false;
      this.diaryService.getDiaryByDate(date);
    } else {
      this.isDateChanged = true;
      this.diaryService.getDiaryByDate(date);
    }
    this.isShowingCalender = false;
  }

  showCalender() {
    this.isShowingCalender = true;
  }

  closeCalender() {
    this.isShowingCalender = false;
  }

  // Work Related Functions
  onWorkEnter() {
    if (this.workText && this.workText.trim().length > 0) {
      const workData: Work = {
        id: this.commonService.randomId(10),
        text: this.workText,
        status: false,
        created: new Date(),
        modified: new Date(),
      };
      if (!this.works) {
        this.works = [];
      }
      this.works.push(workData);
      this.workText = '';

      this.diary.work = this.works;
      this.diaryService.addUpdateDiary(this.diary);
    }
  }

  changeWorkStatus(work: Work) {
    console.log(work);
    work.status = !work.status;
    this.diaryService.addUpdateDiary(this.diary);
  }

  focusWorkTitle(work: Work) {
    work.backupWorkText = cloneDeep(work.text);
  }

  focusOutWorkTitle(work: Work) {
    if (work.backupWorkText !== work.text) {
      work.modified = new Date();
      this.diaryService.addUpdateDiary(this.diary);
    }
    work.isEditing = false;
  }

  enableWorkEdit(work: Work) {
    work.isEditing = true;
  }

  scheduleTask(work: Work) {
    console.log(work);

    const dialogRef = this.dialog.open(ScheduleDialogComponent, {
      width: '270px',
      height: '210px',
      data: {
        positionRelativeToElement: this.workScheduleRef,
      },
    });

    dialogRef.afterClosed().subscribe((result: ScheduleDialogResult) => {
      console.log(result);
      if (!result) {
        return;
      }

      if (result.start) work.start = result.start;
      if (result.end) work.end = result.end;
      this.diaryService.addUpdateDiary(this.diary);
    });
  }

  deleteWork(work: Work) {
    this.works.splice(
      this.works.findIndex((w) => w.id === work.id),
      1
    );
    console.log(this.works);
    this.diaryService.addUpdateDiary(this.diary);
  }

  // Family Related Functions
  onFamilyEnter() {
    if (this.familyText && this.familyText.trim().length > 0) {
      const familyData: Family = {
        id: this.commonService.randomId(10),
        text: this.familyText,
        status: false,
        created: new Date(),
        modified: new Date(),
      };
      if (!this.families) {
        this.families = [];
      }
      this.families.push(familyData);
      this.familyText = '';

      this.diary.families = this.families;
      this.diaryService.addUpdateDiary(this.diary);
    }
  }

  changeFamilyStatus(family: Family) {
    console.log(family);
    family.status = !family.status;
    this.diaryService.addUpdateDiary(this.diary);
  }

  focusFamilyTitle(family: Family) {
    family.backupFamilyText = cloneDeep(family.text);
  }

  focusOutFamilyTitle(family: Family) {
    if (family.backupFamilyText !== family.text) {
      family.modified = new Date();
      this.diaryService.addUpdateDiary(this.diary);
    }
    family.isEditing = false;
  }

  enableFamilyEdit(family: Family) {
    family.isEditing = true;
  }

  scheduleFamilyTask(family: Family) {
    console.log(family);

    const dialogRef = this.dialog.open(ScheduleDialogComponent, {
      width: '270px',
      height: '210px',
      data: {
        positionRelativeToElement: this.familyScheduleRef,
      },
    });

    dialogRef.afterClosed().subscribe((result: ScheduleDialogResult) => {
      console.log(result);
      if (!result) {
        return;
      }

      if (result.start) family.start = result.start;
      if (result.end) family.end = result.end;
      this.diaryService.addUpdateDiary(this.diary);
    });
  }

  deleteFamily(family: Family) {
    this.families.splice(
      this.families.findIndex((w) => w.id === family.id),
      1
    );
    console.log(this.families);
    this.diaryService.addUpdateDiary(this.diary);
  }

  // Selfcare Related Functions
  onSelfcareEnter() {
    if (this.selfcareText && this.selfcareText.trim().length > 0) {
      const selfcareData: SelfCare = {
        id: this.commonService.randomId(10),
        text: this.selfcareText,
        status: false,
        created: new Date(),
        modified: new Date(),
      };
      if (!this.selfcares) {
        this.selfcares = [];
      }
      this.selfcares.push(selfcareData);
      this.selfcareText = '';

      this.diary.selfcares = this.selfcares;
      this.diaryService.addUpdateDiary(this.diary);
    }
  }

  changeSelfcareStatus(selfcare: SelfCare) {
    console.log(selfcare);
    selfcare.status = !selfcare.status;
    this.diaryService.addUpdateDiary(this.diary);
  }

  focusSelfcareTitle(selfcare: SelfCare) {
    selfcare.backupSelfcareText = cloneDeep(selfcare.text);
  }

  focusOutSelfcareTitle(selfcare: SelfCare) {
    if (selfcare.backupSelfcareText !== selfcare.text) {
      selfcare.modified = new Date();
      this.diaryService.addUpdateDiary(this.diary);
    }
    selfcare.isEditing = false;
  }

  enableSelfcareEdit(selfcare: SelfCare) {
    selfcare.isEditing = true;
  }

  scheduleSelfcareTask(selfcare: SelfCare) {
    console.log(selfcare);

    const dialogRef = this.dialog.open(ScheduleDialogComponent, {
      width: '270px',
      height: '210px',
      data: {
        positionRelativeToElement: this.selfcareScheduleRef,
      },
    });

    dialogRef.afterClosed().subscribe((result: ScheduleDialogResult) => {
      console.log(result);
      if (!result) {
        return;
      }

      if (result.start) selfcare.start = result.start;
      if (result.end) selfcare.end = result.end;
      this.diaryService.addUpdateDiary(this.diary);
    });
  }

  deleteSelfcare(selfcare: SelfCare) {
    this.selfcares.splice(
      this.selfcares.findIndex((w) => w.id === selfcare.id),
      1
    );
    console.log(this.selfcares);
    this.diaryService.addUpdateDiary(this.diary);
  }

  // Suggestion Related Functions
  onSuggestionEnter() {
    if (this.suggestionText && this.suggestionText.trim().length > 0) {
      const suggestionData: SelfCare = {
        id: this.commonService.randomId(10),
        text: this.suggestionText,
        status: false,
        created: new Date(),
        modified: new Date(),
      };

      if (!this.suggestions) {
        this.suggestions = [];
      }
      this.suggestions.push(suggestionData);
      this.suggestionText = '';

      this.diary.suggestions = this.suggestions;
      this.diaryService.addUpdateDiary(this.diary);
    }
  }

  // changeSuggestionStatus(suggestion: Suggestion) {
  //   console.log(suggestion);
  //   suggestion.status = !suggestion.status;
  //   // this.diaryService.updateDiary(selfcare);
  // }

  focusSuggestionTitle(suggestion: Suggestion) {
    suggestion.backupSuggestionText = cloneDeep(suggestion.text);
  }

  focusOutSuggestionTitle(suggestion: Suggestion) {
    if (suggestion.backupSuggestionText !== suggestion.text) {
      suggestion.modified = new Date();
      this.diaryService.addUpdateDiary(this.diary);
    }
    suggestion.isEditing = false;
  }

  enableSuggestionEdit(suggestion: Suggestion) {
    suggestion.isEditing = true;
  }

  scheduleSuggestionTask(suggestion: Suggestion) {
    console.log(suggestion);

    const dialogRef = this.dialog.open(ScheduleDialogComponent, {
      width: '270px',
      height: '210px',
      data: {
        positionRelativeToElement: this.suggestionScheduleRef,
      },
    });

    dialogRef.afterClosed().subscribe((result: ScheduleDialogResult) => {
      console.log(result);
      if (!result) {
        return;
      }

      if (result.start) suggestion.start = result.start;
      if (result.end) suggestion.end = result.end;
      this.diaryService.addUpdateDiary(this.diary);
    });
  }

  deleteSuggestion(suggestion: Suggestion) {
    this.suggestions.splice(
      this.suggestions.findIndex((w) => w.id === suggestion.id),
      1
    );
    console.log(this.suggestions);
    this.diaryService.addUpdateDiary(this.diary);
  }

  // Note Related Functions
  onNoteEnter() {
    if (this.noteText && this.noteText.trim().length > 0) {
      const noteData: SelfCare = {
        id: this.commonService.randomId(10),
        text: this.noteText,
        status: false,
        created: new Date(),
        modified: new Date(),
      };
      if (!this.notes) {
        this.notes = [];
      }
      this.notes.push(noteData);
      this.noteText = '';

      this.diary.notes = this.notes;
      this.diaryService.addUpdateDiary(this.diary);
    }
  }

  // changeSuggestionStatus(suggestion: Suggestion) {
  //   console.log(suggestion);
  //   suggestion.status = !suggestion.status;
  //   // this.diaryService.updateDiary(selfcare);
  // }

  focusNoteTitle(note: Note) {
    note.backupNoteText = cloneDeep(note.text);
  }

  focusOutNoteTitle(note: Note) {
    if (note.backupNoteText !== note.text) {
      note.modified = new Date();
      this.diaryService.addUpdateDiary(this.diary);
    }
    note.isEditing = false;
  }

  enableNoteEdit(note: Note) {
    note.isEditing = true;
  }

  // scheduleNoteTask(note: Note) {
  //   console.log(note);

  //   const dialogRef = this.dialog.open(ScheduleDialogComponent, {
  //     width: '270px',
  //     height: '210px',
  //     data: {
  //       positionRelativeToElement: this.noteScheduleRef,
  //     },
  //   });

  //   dialogRef.afterClosed().subscribe((result: ScheduleDialogResult) => {
  //     console.log(result);
  //     if (!result) {
  //       return;
  //     }

  //     if (result.start) note.start = result.start;
  //     if (result.end) note.end = result.end;
  //     // this.diaryService.updateTask(work);
  //   });
  // }

  deleteNote(note: Note) {
    this.notes.splice(
      this.notes.findIndex((w) => w.id === note.id),
      1
    );
    console.log(this.notes);
    this.diaryService.addUpdateDiary(this.diary);
  }

  // Rating related functions
  setWorkRating(rating: number) {
    console.log(rating);
    if (rating == this.workRating) {
      this.workRating = 0;
      return;
    }
    this.workRating = rating;
    this.diary.workRating = this.workRating;
    this.diaryService.addUpdateDiary(this.diary);
  }

  setFamilyRating(rating: number) {
    console.log(rating);
    if (rating == this.familyRating) {
      this.familyRating = 0;
      return;
    }
    this.familyRating = rating;
    this.diary.familyRating = this.familyRating;
    this.diaryService.addUpdateDiary(this.diary);
  }

  setSelfcareRating(rating: number) {
    console.log(rating);
    if (rating == this.selfcareRating) {
      this.selfcareRating = 0;
      return;
    }
    this.selfcareRating = rating;
    this.diary.selfcareRating = this.selfcareRating;
    this.diaryService.addUpdateDiary(this.diary);
  }
}

export interface Diary {
  id?: string;
  work?: Work[];
  families?: Family[];
  selfcares?: SelfCare[];
  suggestions?: Suggestion[];
  notes?: Note[];
  workRating?: number;
  familyRating?: number;
  selfcareRating?: number;
  created?: Date;
  modified?: Date;
}

export interface Work {
  id: string;
  text: string;
  backupWorkText?: string;
  status: boolean;
  isEditing?: boolean;
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
  isEditing?: boolean;
  start?: string;
  end?: string;
  created: Date;
  modified: Date;
}
export interface SelfCare {
  id: string;
  text: string;
  backupSelfcareText?: string;
  status: boolean;
  isEditing?: boolean;
  start?: string;
  end?: string;
  created: Date;
  modified: Date;
}
export interface Suggestion {
  id: string;
  text: string;
  backupSuggestionText?: string;
  start?: string;
  isEditing?: boolean;
  end?: string;
  created: Date;
  modified: Date;
}
export interface Note {
  id: string;
  text: string;
  backupNoteText?: string;
  isEditing?: boolean;
  created: Date;
  modified: Date;
}
export interface Ratings {
  workRating: number;
  familyRating: number;
  selfcareRating: number;
}
