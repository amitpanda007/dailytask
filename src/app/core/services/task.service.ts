import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  QuerySnapshot,
} from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import {
  BehaviorSubject,
  Observable,
  Subject,
  Subscription,
  map,
  take,
} from 'rxjs';
import { Task } from 'src/app/tasks/task/task.component';
import { AuthService } from './auth.service';
import { Label } from 'src/app/common/label-dialog/label-dialog.component';

@Injectable()
export class TaskService {
  private tasksCollection!: AngularFirestoreCollection<Task>;
  private permanentTasksCollection!: AngularFirestoreCollection<Task>;
  private labelsCollection!: AngularFirestoreCollection<Label>;

  items!: Observable<Task[]>;
  private tasksSubscription!: Subscription;
  private permanentTasksSubscription!: Subscription;
  private labelsSubscription!: Subscription;

  private allTasks: Task[] = [];
  private allPermanentTasks: Task[] = [];
  private allLabels: Label[] = [];

  public tasksChanged = new Subject<Task[]>();
  public permanentTasksChanged = new Subject<Task[]>();
  public labelsChanged = new BehaviorSubject<Label[]>([]);

  constructor(
    private afs: AngularFirestore,
    private authService: AuthService
  ) {}

  getUncompletedTasks() {
    const uid = this.authService.getUID();
    return this.afs.collection<Task>(`tasks/${uid}/usertask`, (ref) => {
      let query = ref.where('status', '==', false);
      return query;
    });
  }

  getTasksByDate(date: Date) {
    const startDate = new Date(
      date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    );
    const endDate = new Date(
      date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + (date.getDate() + 1)
    );

    const uid = this.authService.getUID();
    this.tasksCollection = this.afs.collection<Task>(
      `tasks/${uid}/usertask`,
      (ref) => {
        let query = ref
          .where('created', '>=', startDate)
          .where('created', '<', endDate)
          .orderBy('created');
        return query;
      }
    );

    // this.tasksCollection = this.afs.collection<Task>(`tasks/${uid}/usertask`);

    this.tasksSubscription = this.tasksCollection
      .valueChanges({ idField: 'id' })
      .subscribe((tasks) => {
        this.allTasks = tasks;
        this.tasksChanged.next([...this.allTasks]);
      });
  }

  removeTaskSubscription() {
    if (this.tasksSubscription) {
      this.tasksSubscription.unsubscribe();
    }
  }

  getPermanentTasks() {
    const uid = this.authService.getUID();
    this.permanentTasksCollection = this.afs.collection<Task>(
      `tasks/${uid}/longrunningtask`,
      (ref) => {
        let query = ref.orderBy('created');
        return query;
      }
    );

    this.permanentTasksSubscription = this.permanentTasksCollection
      .valueChanges({ idField: 'id' })
      .subscribe((permanentTasks) => {
        this.allPermanentTasks = permanentTasks;
        this.permanentTasksChanged.next([...this.allPermanentTasks]);
      });
  }

  addTask(task: Task) {
    const uid = this.authService.getUID();
    this.tasksCollection = this.afs.collection<Task>(`tasks/${uid}/usertask`);
    this.tasksCollection.add(task);
  }

  updateTask(task: Task, taskType: string) {
    const uid = this.authService.getUID();

    if (taskType === 'DAILY') {
      this.tasksCollection = this.afs.collection<Task>(`tasks/${uid}/usertask`);
    } else if (taskType === 'PERMANENT') {
      this.tasksCollection = this.afs.collection<Task>(
        `tasks/${uid}/longrunningtask`
      );
    }
    this.tasksCollection.doc(task.id).set(task);
  }

  deleteTask(task: Task) {
    const uid = this.authService.getUID();
    this.tasksCollection = this.afs.collection<Task>(`tasks/${uid}/usertask`);
    this.tasksCollection.doc(task.id).delete();
  }

  updateTaskSequence(tasks: Task[]) {
    const uid = this.authService.getUID();
    const db = firebase.firestore();
    const batch = db.batch();

    const taskRefs = tasks.map((t) =>
      db.collection(`tasks/${uid}/usertask`).doc(t.id)
    );
    taskRefs.forEach((ref, idx) => {
      batch.update(ref, { rank: tasks[idx].rank });
    });
    batch.commit();
  }

  moveTaskToLongRun(task: Task) {
    const uid = this.authService.getUID();
    const db = firebase.firestore();
    const batch = db.batch();

    const taskRef = db.collection(`tasks/${uid}/usertask`).doc(task.id);
    batch.delete(taskRef);

    const longTaskRef = db.collection(`tasks/${uid}/longrunningtask`).doc();
    batch.set(longTaskRef, task);

    batch.commit().then(() => {
      // ...
    });
  }

  addLabel(label: Label) {
    const uid = this.authService.getUID();
    this.labelsCollection = this.afs.collection<Label>(`tasks/${uid}/labels`);
    this.labelsCollection.add(label);
  }

  getLabels() {
    const uid = this.authService.getUID();
    this.labelsCollection = this.afs.collection<Label>(`tasks/${uid}/labels`);

    this.labelsSubscription = this.labelsCollection
      .valueChanges({ idField: 'id' })
      .subscribe((labels) => {
        this.allLabels = labels;
        this.labelsChanged.next([...this.allLabels]);
      });
  }

  updateLabel(label: Label) {
    const uid = this.authService.getUID();
    this.labelsCollection = this.afs.collection<Label>(`tasks/${uid}/labels`);
    this.labelsCollection.doc(label.id).set(label);
  }

  deleteLabel(label: Label) {
    const uid = this.authService.getUID();
    this.labelsCollection = this.afs.collection<Label>(`tasks/${uid}/labels`);
    this.labelsCollection.doc(label.id).delete();
  }

  deleteSchedule(task: Task) {
    const uid = this.authService.getUID();
    this.tasksCollection = this.afs.collection<Task>(`tasks/${uid}/usertask`);
    this.tasksCollection.doc(task.id).set(task);
  }
}
