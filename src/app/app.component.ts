import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'today-ui';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.router.navigate(['tasks'], { relativeTo: this.route });
  }
}
