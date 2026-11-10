import { Component, HostListener, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../core/auth/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, MatCardModule, MatTooltipModule, MatIconModule, MatMenuModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  private readonly router = inject(Router);
  protected readonly auth = inject(AuthService);
  protected readonly scrolled = signal(false);

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.scrolled.set(window.scrollY > 70);
  }

  signOut(): void {
    this.auth.logout().subscribe(() => void this.router.navigate(['/signin']));
  }
}
