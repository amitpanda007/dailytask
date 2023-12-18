import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModeToggleService } from 'src/app/core/services/mode-toggle.service';

@Component({
  selector: 'task-options',
  templateUrl: 'task.options.component.html',
  styleUrls: ['task.options.component.scss'],
})
export class TaskOptionsComponent implements OnInit {
  @Input() selectedTheme: string = '#fe387b';
  @Output() themeChanged: EventEmitter<string> = new EventEmitter<string>();
  enableTheme: boolean = true;
  isLightMode: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modeToggleService: ModeToggleService
  ) {}

  ngOnInit(): void {
    // this.router.navigate(['today'], { relativeTo: this.route });

    this.modeToggleService.modeChanged$.subscribe((mode) => {
      this.isLightMode = mode == 'light' ? true : false;
    });
  }

  ngOnDestroy() {}

  selectTheme(theme: string) {
    this.selectedTheme = theme;
    localStorage.setItem('themeColor', this.selectedTheme);
    this.toggleTheme();
    this.themeChanged.emit(theme);
  }

  toggleTheme() {
    this.enableTheme = !this.enableTheme;
  }

  toggleMode() {
    this.modeToggleService.toggleMode();
  }
}
