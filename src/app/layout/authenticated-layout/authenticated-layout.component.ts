import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';
import { CitasBannerComponent } from '../../shared/components/citas-banner/citas-banner.component';
import { ZoomControlComponent } from '../../shared/components/zoom-control/zoom-control.component';
import { AppFooterComponent } from '../footer/app-footer.component';

@Component({
  selector: 'app-authenticated-layout',
  standalone: true,
  imports: [
    RouterOutlet, SidebarComponent, TopbarComponent,
    CitasBannerComponent, ZoomControlComponent, AppFooterComponent
  ],
  template: `
    <div class="app-shell">
      <app-sidebar></app-sidebar>
      <div class="app-main">
        <app-topbar></app-topbar>
        <app-citas-banner></app-citas-banner>
        <main class="app-content">
          <router-outlet></router-outlet>
        </main>
        <app-app-footer></app-app-footer>
      </div>
      <app-zoom-control></app-zoom-control>
    </div>
  `
})
export class AuthenticatedLayoutComponent {}
