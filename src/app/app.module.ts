import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import {
  provideAnalytics,
  getAnalytics,
  ScreenTrackingService,
  UserTrackingService,
} from '@angular/fire/analytics';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { TasksModule } from './tasks/tasks.module';
import { CoreModule } from './core/core.module';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { ScheduleDialogComponent } from './common/schedule-dialog/schedule-dialog.component';
import { ConfirmationDialogComponent } from './common/confirmation-dialog/confirmation-dialog.component';
import { CalendarDialogComponent } from './common/calendar-dialog/calendar-dialog.component';
import { LabelDialogComponent } from './common/label-dialog/label-dialog.component';
import { ColorCircleModule } from 'ngx-color/circle';

@NgModule({
  declarations: [
    AppComponent,
    ScheduleDialogComponent,
    ConfirmationDialogComponent,
    CalendarDialogComponent,
    LabelDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    ColorCircleModule,
    AuthModule,
    CoreModule,
    TasksModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerWhenStable:30000',
    }),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAnalytics(() => getAnalytics()),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
  providers: [
    ScreenTrackingService,
    UserTrackingService,
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase },
  ],
  entryComponents: [
    ScheduleDialogComponent,
    ConfirmationDialogComponent,
    CalendarDialogComponent,
    LabelDialogComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
