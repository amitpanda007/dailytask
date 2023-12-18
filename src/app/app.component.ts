import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'today-ui';
  isOffline: boolean = false;
  todayDate: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // this.authService.loggedIn$.subscribe((isLoggedIn) => {
    //   if (isLoggedIn) {
    //     this.router.navigate(['tasks'], { relativeTo: this.route });
    //   }
    // });

    const options: any = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    this.todayDate = new Date().toLocaleDateString('en-US', options);

    if (navigator.onLine) {
      this.isOffline = false;
    } else {
      this.isOffline = true;
    }

    window.addEventListener('offline', () => {
      this.isOffline = true;
      this._snackBar.open('You are offline', 'Cancel', {
        duration: 2000,
      });
    });

    window.addEventListener('online', () => {
      this.isOffline = false;
      this._snackBar.open('Back online', 'Cancel', {
        duration: 2000,
      });
    });

    if ((navigator as any).standalone == false) {
      // This is an iOS device  and we are in browser
      this._snackBar.open('You can add this PWA to the Home Screen', '', {
        duration: 3000,
      });
    }

    if ((navigator as any).standalone == undefined) {
      // It's not iOS
      if (window.matchMedia('(display-mode: browser').matches) {
        // We are in the browser
        window.addEventListener('beforeinstallprompt', (event) => {
          event.preventDefault();
          const sb = this._snackBar.open(
            'Do you want to install this App?',
            'install',
            { duration: 5000 }
          );
          sb.onAction().subscribe(() => {
            (event as any).prompt();
            (event as any).userChoice.then((result: any) => {
              if (result.outcome == 'dismissed') {
                //TODO: Track on installation
              } else {
                //TODO: It was installed
              }
            });
          });
          return false;
        });
      }
    }
  }
}
