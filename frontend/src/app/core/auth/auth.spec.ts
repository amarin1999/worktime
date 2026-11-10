import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree, provideRouter } from '@angular/router';
import { Observable, firstValueFrom } from 'rxjs';
import { User } from '../api/models';
import { authInterceptor, errorToastInterceptor } from '../http/interceptors';
import { NotifyService } from '../notify.service';
import { authGuard, signinGuard } from './auth.guard';
import { AuthService } from './auth.service';

const USER: User = { employeeNo: '004061', firstname: 'สมชาย', lastname: 'ใจดี', admin: false };
const API = '/workTimeAPI/api';

describe('auth', () => {
  let http: HttpTestingController;
  let auth: AuthService;
  let router: Router;
  let notifyError: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    notifyError = vi.fn();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([authInterceptor, errorToastInterceptor])),
        provideHttpClientTesting(),
        { provide: NotifyService, useValue: { error: notifyError, success: vi.fn(), warn: vi.fn() } },
      ],
    });
    http = TestBed.inject(HttpTestingController);
    auth = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  afterEach(() => http.verify());

  const runGuard = (guard: typeof authGuard) =>
    TestBed.runInInjectionContext(
      () => guard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot) as Observable<boolean | UrlTree>,
    );

  describe('AuthService', () => {
    it('fetches the CSRF cookie before logging in and keeps the user in memory only', async () => {
      const setItem = vi.spyOn(Storage.prototype, 'setItem');
      const result = firstValueFrom(auth.login({ employeeNo: '004061', password: 'secret' }));

      http.expectOne({ method: 'GET', url: `${API}/auth/csrf` }).flush(null, { status: 204, statusText: 'No Content' });
      const login = http.expectOne({ method: 'POST', url: `${API}/auth/login` });
      expect(login.request.body).toEqual({ employeeNo: '004061', password: 'secret' });
      login.flush(USER);

      expect(await result).toEqual(USER);
      expect(auth.user()).toEqual(USER);
      expect(auth.isLoggedIn()).toBe(true);
      expect(setItem).not.toHaveBeenCalled();
      setItem.mockRestore();
    });

    it('shows the problem detail when login fails', async () => {
      const result = firstValueFrom(auth.login({ employeeNo: '1', password: 'bad' })).catch((e: unknown) => e);
      http.expectOne(`${API}/auth/csrf`).flush(null, { status: 204, statusText: 'No Content' });
      http
        .expectOne(`${API}/auth/login`)
        .flush(
          { title: 'Unauthorized', status: 401, detail: 'รหัสพนักงานหรือรหัสผ่านไม่ถูกต้อง' },
          { status: 401, statusText: 'Unauthorized' },
        );
      await result;
      expect(notifyError).toHaveBeenCalledWith('รหัสพนักงานหรือรหัสผ่านไม่ถูกต้อง');
      expect(auth.user()).toBeNull();
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('loadMe() returns null on 401 without a toast', async () => {
      const result = firstValueFrom(auth.loadMe());
      http.expectOne(`${API}/auth/me`).flush(null, { status: 401, statusText: 'Unauthorized' });
      expect(await result).toBeNull();
      expect(notifyError).not.toHaveBeenCalled();
    });

    it('logout() posts and clears the user', async () => {
      auth.login({ employeeNo: '004061', password: 'x' }).subscribe();
      http.expectOne(`${API}/auth/csrf`).flush(null);
      http.expectOne(`${API}/auth/login`).flush(USER);

      const done = firstValueFrom(auth.logout());
      http.expectOne({ method: 'POST', url: `${API}/auth/logout` }).flush(null, { status: 204, statusText: 'No Content' });
      await done;
      expect(auth.user()).toBeNull();
    });
  });

  describe('authGuard', () => {
    it('asks /auth/me when no user is loaded and allows a valid session', async () => {
      const result = firstValueFrom(runGuard(authGuard));
      http.expectOne(`${API}/auth/me`).flush({ ...USER, admin: true });
      expect(await result).toBe(true);
      expect(auth.isAdmin()).toBe(true);
    });

    it('redirects to /signin without a session', async () => {
      const result = firstValueFrom(runGuard(authGuard));
      http.expectOne(`${API}/auth/me`).flush(null, { status: 401, statusText: 'Unauthorized' });
      const tree = (await result) as UrlTree;
      expect(router.serializeUrl(tree)).toBe('/signin');
    });

    it('does not call the server again once the user is known', async () => {
      auth.loadMe().subscribe();
      http.expectOne(`${API}/auth/me`).flush(USER);
      expect(await firstValueFrom(runGuard(authGuard))).toBe(true);
      http.expectNone(`${API}/auth/me`);
    });
  });

  describe('signinGuard', () => {
    it('sends a logged-in user to the calendar', async () => {
      const result = firstValueFrom(runGuard(signinGuard));
      http.expectOne(`${API}/auth/me`).flush(USER);
      expect(router.serializeUrl((await result) as UrlTree)).toBe('/main/sidework-calendar');
    });
  });

  describe('authInterceptor', () => {
    it('clears the user and navigates to /signin on 401 from a data endpoint', async () => {
      auth.loadMe().subscribe();
      http.expectOne(`${API}/auth/me`).flush(USER);

      const request = firstValueFrom(TestBed.inject(HttpClient).get(`${API}/sidework`)).catch((e: unknown) => e);
      http.expectOne(`${API}/sidework`).flush(null, { status: 401, statusText: 'Unauthorized' });
      await request;

      expect(auth.user()).toBeNull();
      expect(router.navigate).toHaveBeenCalledWith(['/signin']);
      expect(notifyError).not.toHaveBeenCalled();
    });

    it('shows a toast (not a redirect) for other errors', async () => {
      const request = firstValueFrom(TestBed.inject(HttpClient).delete(`${API}/sidework/9`)).catch((e: unknown) => e);
      http
        .expectOne(`${API}/sidework/9`)
        .flush({ status: 404, detail: 'ไม่พบข้อมูล' }, { status: 404, statusText: 'Not Found' });
      await request;
      expect(notifyError).toHaveBeenCalledWith('ไม่พบข้อมูล');
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });
});
