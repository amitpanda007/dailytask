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
import { DiaryModule } from './diary/diary.module';

@NgModule({
  declarations: [AppComponent, ScheduleDialogComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    AuthModule,
    CoreModule,
    TasksModule,
    DiaryModule,
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
  entryComponents: [ScheduleDialogComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
