import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Observable, Subject, Subscription } from 'rxjs';
import { Diary } from 'src/app/diary/diary/diary.component';
import { AuthService } from './auth.service';

@Injectable()
export class DiaryService {
  private diaryCollection!: AngularFirestoreCollection<Diary>;
  private diaryDocument!: AngularFirestoreDocument<Diary>;
  private diarySubscription!: Subscription;
  private allDiary!: Diary;
  public diaryChanged = new Subject<Diary>();

  constructor(
    private afs: AngularFirestore,
    private authService: AuthService
  ) {}

  getDiaryByDate(date: Date) {
    const uid = this.authService.getUID();
    const docId = this.todayString(date);
    this.diaryDocument = this.afs.doc<Diary>(`diary/${uid}/userdiary/${docId}`);

    this.diarySubscription = this.diaryDocument
      .valueChanges({ idField: 'id' })
      .subscribe((diary) => {
        this.diaryChanged.next(diary as Diary);
      });
  }

  addUpdateDiary(diary: Diary) {
    const docId = this.todayString(new Date());
    const uid = this.authService.getUID();
    this.diaryCollection = this.afs.collection<Diary>(`diary/${uid}/userdiary`);
    this.diaryCollection.doc(docId).set(diary);
  }

  todayString(date: Date) {
    const monthNames = [
      'jan',
      'feb',
      'mar',
      'apr',
      'may',
      'jun',
      'jul',
      'aug',
      'sep',
      'oct',
      'nov',
      'dec',
    ];
    // const date = new Date();
    const today =
      date.getDate() +
      '-' +
      monthNames[date.getMonth()] +
      '-' +
      date.getFullYear();
    return today;
  }
}
