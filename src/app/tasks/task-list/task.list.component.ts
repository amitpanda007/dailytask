import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'task-list',
  templateUrl: 'task.list.component.html',
  styleUrls: ['task.list.component.scss'],
})
export class TaskListComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.router.navigate(['today'], { relativeTo: this.route });
  }

  ngOnDestroy() {}

  navigateToTask() {
    let random = Math.floor(Math.random() * 10);
    this.router.navigate([random], { relativeTo: this.route });
  }
}
