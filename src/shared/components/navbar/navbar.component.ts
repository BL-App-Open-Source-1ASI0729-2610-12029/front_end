import { Component, Output, EventEmitter, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../iam/application/auth.service';
import { SettingsStore } from '../../../settings/application/settings.store';
import { GOOGLE_ICONS } from '../../constants/google-icons';
import { GlobalSearchService } from '../../services/global-search.service';
import { UiFeedbackService } from '../../services/ui-feedback.service';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';
import { MATERIAL_IMPORTS } from '../../material';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, TranslateModule, LanguageSwitcherComponent, ...MATERIAL_IMPORTS],
  template: `
    <header class="navbar" [class.layout-sidebar-open]="sidebarOpen">
      <div class="navbar-start">
        <button mat-icon-button type="button" class="hamburger-btn" (click)="toggleSidebar.emit()" [attr.aria-label]="'navigation.menu' | translate">
          <mat-icon>menu</mat-icon>
        </button>
      </div>

      <div class="navbar-center">
        <mat-form-field appearance="outline" class="navbar-search" subscriptSizing="dynamic">
          <mat-icon matPrefix class="search-icon">search</mat-icon>
          <input
            matInput
            type="search"
            [placeholder]="searchPlaceholder()"
            (keydown.enter)="onSearchSubmit($event)"
          />
        </mat-form-field>
      </div>

      <div class="navbar-end">
        <app-language-switcher></app-language-switcher>

        <button mat-icon-button type="button" class="btn-icon" [matTooltip]="'overlay.notifications' | translate" (click)="onNotifications()">
          <mat-icon>notifications</mat-icon>
        </button>

        <button mat-icon-button type="button" class="btn-icon btn-icon--help" [matTooltip]="'overlay.helpCenter' | translate" (click)="onHelp()">
          <mat-icon>help_outline</mat-icon>
        </button>

        <div class="user-profile-small">
          <div class="user-info-small">
            <span class="user-name-small">{{ settingsStore.settings().fullName }}</span>
            <span class="user-role-small">{{ roleLabel() }}</span>
          </div>
          <button type="button" mat-button class="btn-profile btn-profile--photo" (click)="onProfile()">
            <img [src]="settingsStore.getProfilePhoto()" [alt]="settingsStore.settings().fullName" class="navbar-avatar" />
          </button>
        </div>
      </div>
    </header>
  `,
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();
  @Input() sidebarOpen = true;
  readonly icons = GOOGLE_ICONS;
  readonly settingsStore = inject(SettingsStore);

  private readonly auth = inject(AuthService);
  private readonly feedback = inject(UiFeedbackService);
  private readonly globalSearch = inject(GlobalSearchService);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.settingsStore.fetchSettings();
    }
  }

  searchPlaceholder(): string {
    const key =
      this.auth.getAccountType() === 'small-business'
        ? 'navbar.searchPlaceholderBusiness'
        : 'navbar.searchPlaceholder';
    return this.translate.instant(key);
  }

  roleLabel(): string {
    if (this.auth.getAccountType() === 'small-business') {
      return this.translate.instant('navbar.facilityManager');
    }
    const key = this.settingsStore.settings().roleKey ?? 'settings.administrator';
    return this.translate.instant(key);
  }

  onNotifications(): void {
    this.feedback.toggleNotifications();
  }

  onHelp(): void {
    this.feedback.openHelp('general');
  }

  onProfile(): void {
    this.router.navigate(['/app/settings']);
  }

  onSearchSubmit(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();
    if (!value) return;

    const accountType = this.auth.getAccountType() === 'small-business' ? 'small-business' : 'smart-home';
    const route = this.globalSearch.resolveRoute(value, accountType);
    if (!route.length) return;

    this.router.navigate(route, { queryParams: { q: value } });
    this.feedback.showToast(
      this.translate.instant('navbar.searchNavigating', { query: value }),
      'info',
    );
  }
}
