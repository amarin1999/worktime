import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingService } from './core/loading.service';
import { Navbar } from './layout/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  template: `
    <app-navbar />
    <main class="layout-wrapper">
      <router-outlet />
    </main>
    @if (loading.loading()) {
      <div class="loading-overlay" role="status" aria-label="กำลังโหลด">
        <img src="assets/images/loading.svg" alt="" />
      </div>
    }
  `,
  styles: `
    .loading-overlay {
      position: fixed;
      inset: 0;
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.6);
    }
    .loading-overlay img {
      width: 200px;
    }
  `,
})
export class App {
  protected readonly loading = inject(LoadingService);
}
