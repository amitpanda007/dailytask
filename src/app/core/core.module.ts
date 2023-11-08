import { NgModule, SkipSelf, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { EnsureModuleLoadedOnceGuard } from './services/ensure-module-loaded-once.guard';
import { AuthService } from './services/auth.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { TaskService } from './services/task.service';
import { NavComponent } from './nav/nav.component';
import { HomeComponent } from '../home/home.component';
import { CommonService } from './services/common.service';
import { MODE_STORAGE_SERVICE, ModeLocalStorageService } from './services/mode-storage.service';
import { ModeToggleService } from './services/mode-toggle.service';

@NgModule({
  imports: [CommonModule, SharedModule],
  exports: [NavComponent, HomeComponent],
  declarations: [NavComponent, HomeComponent],
  providers: [
    AuthService,
    TaskService,
    CommonService,
    ModeToggleService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {
      provide: MODE_STORAGE_SERVICE,
      useClass: ModeLocalStorageService,
    },
  ],
})
export class CoreModule extends EnsureModuleLoadedOnceGuard {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    super(parentModule);
  }
}
