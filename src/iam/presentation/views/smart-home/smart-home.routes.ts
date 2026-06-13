import { Routes } from '@angular/router';
import { isSmartHomeAccount } from '../../../application/account-type.guard';

/** Hogares Inteligentes — rutas visibles tras login */
export const smartHomeRoutes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('../../../../dashboard/presentation/dashboard.routes').then(m => m.dashboardRoutes),
  },
  {
    path: 'security',
    loadChildren: () =>
      import('../../../../security/presentation/routes/security.routes').then(m => m.securityRoutes),
  },
  {
    path: 'devices',
    canMatch: [isSmartHomeAccount],
    loadChildren: () =>
      import('../../../../device-control/device-control.routes').then(m => m.deviceControlRoutes),
  },
  {
    path: 'automation',
    loadChildren: () =>
      import('../../../../automation/presentation/routes/automation.routes').then(m => m.automationRoutes),
  },
  {
    path: 'history',
    loadChildren: () =>
      import('../../../../history/presentation/history.routes').then(m => m.historyRoutes),
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('../../../../settings/presentation/settings.routes').then(m => m.settingsRoutes),
  },
];
