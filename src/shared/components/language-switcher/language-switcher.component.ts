import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { MATERIAL_IMPORTS } from '../../material';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule, ...MATERIAL_IMPORTS],
  template: `
    <div class="language-switcher">
      <button
        mat-button
        type="button"
        class="lang-btn"
        [class.active]="currentLanguage === 'es'"
        (click)="setLanguage('es')">
        ES
      </button>
      <span class="separator">|</span>
      <button
        mat-button
        type="button"
        class="lang-btn"
        [class.active]="currentLanguage === 'en'"
        (click)="setLanguage('en')">
        EN
      </button>
    </div>
  `,
  styles: [`
    .language-switcher {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      background: rgba(90, 102, 129, 0.06);
      border: 1px solid rgba(90, 102, 129, 0.12);
    }

    .lang-btn.active {
      background: rgba(47, 108, 235, 0.15);
      color: var(--primary-color);
      font-weight: 700;
    }

    .separator {
      color: rgba(90, 102, 129, 0.3);
      font-weight: 300;
    }

    @media (max-width: 480px) {
      .language-switcher {
        padding: 0.15rem 0.35rem;
      }
    }
  `]
})
export class LanguageSwitcherComponent {
  constructor(private translate: TranslateService) {}

  get currentLanguage(): string {
    return this.translate.currentLang || this.translate.defaultLang || 'es';
  }

  setLanguage(language: string): void {
    this.translate.use(language);
  }
}
