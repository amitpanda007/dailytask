import { Component, Output, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'color-icon-list',
  template: `
    <color-icon
      [theme]="'red1'"
      (changedTheme)="selectTheme($event)"
    ></color-icon>
    <color-icon
      [theme]="'orange1'"
      (changedTheme)="selectTheme($event)"
    ></color-icon>
    <color-icon
      [theme]="'green1'"
      (changedTheme)="selectTheme($event)"
    ></color-icon>
    <color-icon
      [theme]="'green2'"
      (changedTheme)="selectTheme($event)"
    ></color-icon>
    <color-icon
      [theme]="'green3'"
      (changedTheme)="selectTheme($event)"
    ></color-icon>
    <color-icon
      [theme]="'pink1'"
      (changedTheme)="selectTheme($event)"
    ></color-icon>
    <color-icon
      [theme]="'pink2'"
      (changedTheme)="selectTheme($event)"
    ></color-icon>
    <color-icon
      [theme]="'blue1'"
      (changedTheme)="selectTheme($event)"
    ></color-icon>
    <color-icon
      [theme]="'blue2'"
      (changedTheme)="selectTheme($event)"
    ></color-icon>
    <color-icon
      [theme]="'blue3'"
      (changedTheme)="selectTheme($event)"
    ></color-icon>
    <color-icon
      [theme]="'yellow1'"
      (changedTheme)="selectTheme($event)"
    ></color-icon>
    <color-icon
      [theme]="'yellow2'"
      (changedTheme)="selectTheme($event)"
    ></color-icon>
    <color-icon
      [theme]="'purple1'"
      (changedTheme)="selectTheme($event)"
    ></color-icon>
    <color-icon
      [theme]="'purple2'"
      (changedTheme)="selectTheme($event)"
    ></color-icon>
    <color-icon
      [theme]="'cream1'"
      (changedTheme)="selectTheme($event)"
    ></color-icon>
    <color-icon
      [theme]="'cream2'"
      (changedTheme)="selectTheme($event)"
    ></color-icon>
    <color-icon
      [theme]="'cream3'"
      (changedTheme)="selectTheme($event)"
    ></color-icon>
  `,
})
export class ColorIconListComponent implements OnInit {
  @Output() themeSelected: EventEmitter<string> = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy() {}

  selectTheme($event: any) {
    this.themeSelected.emit($event);
  }
}
