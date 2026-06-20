import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { catchError, finalize, timeout } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiWarmupService {
  private readonly http = inject(HttpClient);

  readonly warming = signal(false);
  readonly ready = signal(false);

  warmUp(): void {
    if (!environment.apiUrl?.trim() || this.ready() || this.warming()) {
      return;
    }

    this.warming.set(true);
    const healthUrl = this.healthCheckUrl();

    this.http
      .get(healthUrl, { responseType: 'text' })
      .pipe(
        timeout(120_000),
        catchError(() => of(null)),
        finalize(() => {
          this.warming.set(false);
          this.ready.set(true);
        }),
      )
      .subscribe();
  }

  private healthCheckUrl(): string {
    const base = environment.apiUrl.replace(/\/$/, '');
    const root = base.endsWith('/api/v1') ? base.slice(0, -'/api/v1'.length) : base;
    return `${root}/actuator/health`;
  }
}
