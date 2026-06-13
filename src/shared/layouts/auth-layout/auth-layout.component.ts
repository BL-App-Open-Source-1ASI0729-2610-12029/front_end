import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter, map, startWith } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="auth-layout">
      <div
        class="auth-container"
        [class.auth-container--wide]="isWide()"
        [class.auth-container--register]="isRegister()">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .auth-layout {
      min-height: 100vh;
      background: linear-gradient(180deg, var(--gray-100) 0%, var(--background) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .auth-container {
      width: 100%;
      max-width: 420px;
      padding: 2rem;
      background: var(--white);
      border-radius: 24px;
      box-shadow: var(--shadow-lg);
      border: 1px solid var(--gray-200);
    }

    .auth-container--register {
      max-width: 520px;
      padding: 2.5rem;
    }

    .auth-container--wide {
      max-width: 860px;
      padding: 2rem 2.25rem;
      background: var(--white);
      border-radius: 24px;
      box-shadow: var(--shadow-lg);
      border: 1px solid var(--gray-200);
    }

    :root[data-theme='dark'] .auth-container {
      background: var(--surface);
      border-color: var(--gray-200);
    }

    @media (max-width: 768px) {
      .auth-layout {
        padding: 1rem;
      }

      .auth-container,
      .auth-container--register,
      .auth-container--wide {
        padding: 1.5rem;
      }
    }
  `],
})
export class AuthLayoutComponent {
  private readonly translate = inject(TranslateService);
  private readonly router = inject(Router);

  readonly isWide = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.router.url.includes('/onboarding')),
      startWith(this.router.url.includes('/onboarding')),
    ),
    { initialValue: false },
  );

  readonly isRegister = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.router.url.includes('/register')),
      startWith(this.router.url.includes('/register')),
    ),
    { initialValue: false },
  );

  constructor() {
    this.initializeTranslations();
  }

  private initializeTranslations() {
    const browserLang = this.translate.getBrowserLang() || 'es';
    const supportedLanguages = ['en', 'es'];
    const currentLanguage = supportedLanguages.includes(browserLang) ? browserLang : 'es';

    this.translate.setDefaultLang('es');
    this.translate.use(currentLanguage);
  }
}
