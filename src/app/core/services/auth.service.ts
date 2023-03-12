import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { User } from 'src/app/auth/user';

@Injectable()
export class AuthService {
  private usersCollection!: AngularFirestoreCollection<User>;

  loggedIn = new Subject<boolean>();
  loggedIn$ = this.loggedIn.asObservable();

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private auth: AngularFireAuth,
    private afs: AngularFirestore
  ) {
    // this.auth.onAuthStateChanged((user) => {
    //   if (user) {
    //     this.loggedIn.next(true);
    //   } else {
    //     // not logged in
    //     this.loggedIn.next(false);
    //   }
    // });
    this.checkAuth();
  }

  checkAuth() {
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.loggedIn.next(true);
      } else {
        // not logged in
        this.loggedIn.next(false);
      }
    });
  }

  async register(user: any) {
    const { fullName, email, password } = user;

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        let user = userCredential.user;

        userCredential.user?.updateProfile({ displayName: fullName });

        // Save data to firebase collection
        const UID = user?.uid;
        const newUser: User = {
          id: UID as string,
          name: fullName,
          email: user?.email as string,
          creationDate: new Date(),
        };
        this.usersCollection = this.afs.collection<User>('users');
        this.usersCollection.doc(UID).set(newUser);

        this.router.navigate(['']);
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
      });
  }

  async login(user: any) {
    const { email, password } = user;
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        this.router.navigate(['']);
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
      });
  }

  logout() {
    this.auth.signOut();
    this.router.navigate(['/login']);
  }

  resetUserPassword(email: string) {
    return;
  }

  getUID() {
    return firebase.auth().currentUser?.uid;
  }

  isLoggedIn() {
    const currentUser = firebase.auth().currentUser;
    return !!currentUser;
  }

  getUsername() {
    const displayName = firebase.auth().currentUser?.displayName;
    return displayName;
  }
}
