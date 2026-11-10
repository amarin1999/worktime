import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, switchMap, tap } from 'rxjs';
import { API_BASE_URL, SKIP_ERROR_TOAST } from '../api/api';
import { LoginRequest, User } from '../api/models';

/**
 * Holds the signed-in user in memory only. The session itself is an HttpOnly cookie
 * managed by the server, so nothing auth-related is ever written to web storage.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_BASE_URL}/auth`;

  private readonly currentUser = signal<User | null>(null);

  readonly user = this.currentUser.asReadonly();
  readonly isLoggedIn = computed(() => this.currentUser() !== null);
  readonly isAdmin = computed(() => this.currentUser()?.admin === true);

  /** Fetches the CSRF cookie, then logs in. */
  login(request: LoginRequest): Observable<User> {
    return this.http.get<void>(`${this.url}/csrf`).pipe(
      switchMap(() => this.http.post<User>(`${this.url}/login`, request)),
      tap((user) => this.currentUser.set(user)),
    );
  }

  /** Loads the current user from the session cookie. Emits `null` when not logged in. */
  loadMe(): Observable<User | null> {
    const context = new HttpContext().set(SKIP_ERROR_TOAST, true);
    return this.http.get<User>(`${this.url}/me`, { context }).pipe(
      tap((user) => this.currentUser.set(user)),
      catchError(() => {
        this.currentUser.set(null);
        return of(null);
      }),
    );
  }

  /** Returns the cached user or asks the server once. */
  ensureUser(): Observable<User | null> {
    const user = this.currentUser();
    return user ? of(user) : this.loadMe();
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.url}/logout`, null).pipe(
      catchError(() => of(undefined)),
      tap(() => this.clear()),
      map(() => undefined),
    );
  }

  clear(): void {
    this.currentUser.set(null);
  }
}
