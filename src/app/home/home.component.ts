import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss'],
})
export class HomeComponent implements OnInit {
  isLoading!: boolean;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.authService.checkAuth();
    this.authService.loggedIn$.subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        // this.router.navigate(['tasks'], { relativeTo: this.route });
        this.isLoading = false;
      } else {
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy(): void {}

  navigate(partial: string) {
    switch (partial) {
      case 'login':
        this.router.navigate(['/login']);
        break;
      case 'tasks':
        this.router.navigate(['/tasks']);
        break;
      case 'diary':
        this.router.navigate(['/diary']);
        break;
      default:
        this.router.navigate(['']);
        break;
    }
  }
}
