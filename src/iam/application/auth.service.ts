import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { SettingsStore } from '../../settings/application/settings.store';
import { LocalDataCacheService } from '../../shared/services/local-data-cache.service';
import { AccountType, getAccountTypeRoute, isOnboardingComplete } from '../domain/model/account-type.entity';
import { AuthUser, createLocalUser, stripPassword } from '../domain/model/auth-user.entity';
import { AUTH_SESSION_KEY, AUTH_TOKEN_KEY } from '../infrastructure/auth-api-endpoint';
import { LocalAuthRepository } from '../infrastructure/local-auth.repository';

export type { AuthUser };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly localAuth = inject(LocalAuthRepository);
  private readonly router = inject(Router);
  private readonly cache = inject(LocalDataCacheService);
  private readonly settingsStore = inject(SettingsStore);

  currentUser: AuthUser | null = null;

  constructor() {
    this.loadSession();
  }

  private loadSession(): void {
    const raw = localStorage.getItem(AUTH_SESSION_KEY);
    if (!raw) {
      this.currentUser = null;
      return;
    }

    try {
      this.currentUser = JSON.parse(raw) as AuthUser;
    } catch {
      this.currentUser = null;
    }
  }

  private persistSession(user: AuthUser): void {
    this.currentUser = user;
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(user));
  }

  private clearUserScopedCache(): void {
    this.cache.clear('user-profile');
    this.cache.clear('users');
    this.cache.clear('business-profile');
    this.cache.clear('zone-configuration');
    this.cache.clear('team-management');
    this.cache.clear('cost-analysis');
  }

  private afterAuthenticated(user: AuthUser): Observable<AuthUser> {
    this.clearUserScopedCache();
    this.persistSession(user);
    this.settingsStore.reset();
    this.settingsStore.fetchSettings();

    return this.localAuth.refreshUser(user.id).pipe(
      tap(refreshed => {
        if (refreshed) {
          this.persistSession(refreshed);
        }
      }),
      map(refreshed => refreshed ?? user),
      catchError(() => of(user)),
    );
  }

  isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  hasCompletedOnboarding(): boolean {
    return isOnboardingComplete(this.currentUser?.accountType, this.currentUser?.onboardingCompleted);
  }

  getAccountType(): AccountType | null {
    return this.currentUser?.accountType ?? null;
  }

  getDefaultRoute(): string {
    if (!this.isAuthenticated()) return '/auth/login';
    if (!this.hasCompletedOnboarding()) return '/auth/onboarding';
    return getAccountTypeRoute(this.currentUser!.accountType!);
  }

  login(email: string, password: string): Observable<boolean> {
    const normalizedEmail = email.trim().toLowerCase();

    if (this.localAuth.hasApi()) {
      return this.localAuth.loginWithApi(normalizedEmail, password).pipe(
        switchMap(response =>
          this.afterAuthenticated(response.user).pipe(
            map(() => true),
            catchError(() => {
              this.persistSession(response.user);
              return of(true);
            }),
          ),
        ),
        catchError(() => of(false)),
      );
    }

    return this.localAuth.loadUsers().pipe(
      map(users => this.localAuth.findByCredentials(users, normalizedEmail, password)),
      switchMap(user => {
        if (!user) return of(false);
        return this.afterAuthenticated(stripPassword(user)).pipe(map(() => true));
      }),
      catchError(() => of(false)),
    );
  }

  register(name: string, email: string, password: string): Observable<AuthUser | null> {
    const normalizedEmail = email.trim().toLowerCase();

    if (this.localAuth.hasApi()) {
      return this.localAuth.registerWithApi(name.trim(), normalizedEmail, password).pipe(
        switchMap(response =>
          this.afterAuthenticated(response.user).pipe(
            map(() => response.user),
            catchError(() => {
              this.persistSession(response.user);
              return of(response.user);
            }),
          ),
        ),
        catchError(() => of(null)),
      );
    }

    return this.localAuth.loadUsers().pipe(
      switchMap(users => {
        if (this.localAuth.emailExists(users, normalizedEmail)) {
          return of(null);
        }

        const newUser = createLocalUser(name.trim(), normalizedEmail, password);
        return this.localAuth.persistNewUser(newUser, users).pipe(
          map(() => newUser),
          catchError(() => {
            this.localAuth.appendUser(newUser, users);
            return of(newUser);
          }),
        );
      }),
      switchMap(user => {
        if (!user) return of(null);
        return this.afterAuthenticated(stripPassword(user)).pipe(map(() => user));
      }),
      catchError(() => of(null)),
    );
  }

  completeOnboarding(accountType: AccountType): Observable<boolean> {
    if (!this.currentUser) {
      return of(false);
    }

    const userId = this.currentUser.id;
    const updatedUser: AuthUser = {
      ...this.currentUser,
      accountType,
      onboardingCompleted: true,
    };
    this.persistSession(updatedUser);

    return this.localAuth
      .updateUser(userId, { accountType, onboardingCompleted: true })
      .pipe(
        tap(user => {
          if (user) {
            this.persistSession(user);
          }
        }),
        map(() => true),
        catchError(() => of(true)),
      );
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem(AUTH_SESSION_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    this.clearUserScopedCache();
    this.settingsStore.reset();
    this.router.navigate(['/auth/login']);
  }
}
