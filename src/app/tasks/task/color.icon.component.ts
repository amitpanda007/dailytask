import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'color-icon',
  template: `
    <style>
      .red1 {
        color: #fe1045;
      }
      .orange1 {
        color: #ed5728;
      }
      .green1 {
        color: #40c19d;
      }
      .green2 {
        color: #25b560;
      }
      .green3 {
        color: #96ff01;
      }
      .pink1 {
        color: #f86ca6;
      }
      .pink2 {
        color: #fe387b;
      }
      .blue1 {
        color: #5a59ff;
      }
      .blue2 {
        color: #609ef2;
      }
      .blue3 {
        color: #09d9ff;
      }
      .yellow1 {
        color: #f6ff81;
      }
      .yellow2 {
        color: #ffd155;
      }
      .purple1 {
        color: #bc4ff3;
      }
      .purple2 {
        color: #d99ee6;
      }
      .cream1 {
        color: #fdc799;
      }

      .mat-click {
        cursor: pointer;
      }

      .icon {
        margin-left: 2rem;
      }

      .mat-icon {
        font-size: 40px;
        width: 40px;
        height: 40px;
      }
    </style>
    <mat-icon
      class="icon mat-click"
      [ngClass]="theme"
      aria-hidden="false"
      aria-label="close"
      class="mat-click"
      (click)="selectTheme()"
      >trip_origin</mat-icon
    >
  `,
})
export class ColorIconComponent implements OnInit {
  @Input() theme: string = 'red1';
  @Output() changedTheme: EventEmitter<string> = new EventEmitter<string>();
  selectedTheme: string = '#fe1045';

  themeColors = {
    red1: '#fe1045',
    orange1: '#ed5728',
    green1: '#40c19d',
    green2: '#25b560',
    green3: '#96ff01',
    pink1: '#f86ca6',
    pink2: '#fe387b',
    blue1: '#5a59ff',
    blue2: '#609ef2',
    blue3: '#09d9ff',
    yellow1: '#f6ff81',
    yellow2: '#ffd155',
    purple1: '#bc4ff3',
    purple2: '#d99ee6',
    cream1: '#fdc799',
  };

  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy() {}

  selectTheme() {
    switch (this.theme) {
      case 'red1':
        this.selectedTheme = this.themeColors.red1;
        break;
      case 'orange1':
        this.selectedTheme = this.themeColors.orange1;
        break;
      case 'green1':
        this.selectedTheme = this.themeColors.green1;
        break;
      case 'green2':
        this.selectedTheme = this.themeColors.green2;
        break;
      case 'green3':
        this.selectedTheme = this.themeColors.green3;
        break;
      case 'pink1':
        this.selectedTheme = this.themeColors.pink1;
        break;
      case 'pink2':
        this.selectedTheme = this.themeColors.pink2;
        break;
      case 'blue1':
        this.selectedTheme = this.themeColors.blue1;
        break;
      case 'blue2':
        this.selectedTheme = this.themeColors.blue2;
        break;
      case 'blue3':
        this.selectedTheme = this.themeColors.blue3;
        break;
      case 'yellow1':
        this.selectedTheme = this.themeColors.yellow1;
        break;
      case 'yellow2':
        this.selectedTheme = this.themeColors.yellow2;
        break;
      case 'purple1':
        this.selectedTheme = this.themeColors.purple1;
        break;
      case 'purple2':
        this.selectedTheme = this.themeColors.purple2;
        break;
      case 'cream1':
        this.selectedTheme = this.themeColors.cream1;
        break;
      default:
        this.selectedTheme = this.themeColors.blue2;
    }
    this.changedTheme.emit(this.selectedTheme);
  }
}
