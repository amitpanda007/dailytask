import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Task } from 'src/app/tasks/task/task.component';
import { AuthService } from './auth.service';

@Injectable()
export class TaskService {
  private tasksCollection!: AngularFirestoreCollection<Task>;
  items!: Observable<Task[]>;
  private tasksSubscription!: Subscription;

  private allTasks: Task[] = [];
  public tasksChanged = new BehaviorSubject<Task[]>([]);

  constructor(
    private afs: AngularFirestore,
    private authService: AuthService
  ) {}

  getTasks() {
    const date = new Date();
    const startDate = new Date(
      date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    );
    const endDate = new Date(
      date.getFullYear() +
        '-' +
        (date.getMonth() + 1) +
        '-' +
        (date.getDate() + 1)
    );
    const uid = this.authService.getUID();
    this.tasksCollection = this.afs.collection<Task>(
      `tasks/${uid}/usertask`,
      (ref) => {
        let query = ref
          .where('created', '>', startDate)
          .where('created', '<', endDate)
          .orderBy('created');
        return query;
      }
    );

    // this.items = this.tasksCollection.valueChanges({ idField: 'id' });

    this.tasksSubscription = this.tasksCollection
      .valueChanges({ idField: 'id' })
      .subscribe((tasks) => {
        this.allTasks = tasks;
        this.tasksChanged.next([...this.allTasks]);
      });
  }

  getTasksByDate(date: Date) {
    const startDate = new Date(
      date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    );
    const endDate = new Date(
      date.getFullYear() +
        '-' +
        (date.getMonth() + 1) +
        '-' +
        (date.getDate() + 1)
    );

    const uid = this.authService.getUID();
    this.tasksCollection = this.afs.collection<Task>(
      `tasks/${uid}/usertask`,
      (ref) => {
        let query = ref
          .where('created', '>', startDate)
          .where('created', '<', endDate)
          .orderBy('created');
        return query;
      }
    );

    // this.items = this.tasksCollection.valueChanges({
    //   idField: 'id',
    // });
    this.tasksSubscription = this.tasksCollection
      .valueChanges({ idField: 'id' })
      .subscribe((tasks) => {
        this.allTasks = tasks;
        this.tasksChanged.next([...this.allTasks]);
      });
  }

  addTask(task: Task) {
    const uid = this.authService.getUID();
    this.tasksCollection = this.afs.collection<Task>(`tasks/${uid}/usertask`);
    this.tasksCollection.add(task);
  }

  updateTask(task: Task) {
    const uid = this.authService.getUID();
    this.tasksCollection = this.afs.collection<Task>(`tasks/${uid}/usertask`);
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
}
