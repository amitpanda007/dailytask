import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private auth: AngularFireAuth
  ) {}

  async register(user: any) {
    const { fullName, email, password } = user;

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;

        // resp.user.updateProfile({ displayName: fullName });

        // Save data to firebase collection
        //   const UID = resp.user.uid;
        //   const newUser: User = {
        //     id: UID,
        //     name: fullName,
        //     email: resp.user.email,
        //     creationDate: new Date(),
        //   };
        //   this._store.collection('users').doc(UID).set(newUser);

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

  isLoggedIn() {
    const currentUser = firebase.auth().currentUser;
    return !!currentUser;
  }
}
