import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'diary-list',
  templateUrl: 'diary.list.component.html',
  styleUrls: ['diary.list.component.scss'],
})
export class DiaryListComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.router.navigate(['today'], { relativeTo: this.route });
  }

  ngOnDestroy() {}
}
