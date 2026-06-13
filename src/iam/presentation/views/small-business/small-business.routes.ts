import { Routes } from '@angular/router';
import { isSmallBusinessAccount } from '../../../application/account-type.guard';

/** Pequeños Negocios y Emprendedores — rutas visibles tras login */
export const smallBusinessRoutes: Routes = [
  {
    path: 'operations-hub',
    loadChildren: () =>
      import('../../../../sme-operations-hub/presentation/sme-operations-hub.routes').then(
        m => m.smeOperationsHubRoutes,
      ),
  },
  {
    path: 'devices',
    canMatch: [isSmallBusinessAccount],
    loadChildren: () =>
      import('../../../../device-control/business-device.routes').then(m => m.businessDeviceRoutes),
  },
  {
    path: 'reports',
    loadChildren: () =>
      import('../../../../history/presentation/business-reports.routes').then(
        m => m.businessReportsRoutes,
      ),
  },
  {
    path: 'smart-integrations',
    loadChildren: () =>
      import('../../../../smart-integrations/presentation/routes/smart-integrations.routes').then(
        m => m.smartIntegrationsRoutes,
      ),
  },
  {
    path: 'automation',
    loadChildren: () =>
      import('../../../../automation/presentation/routes/automation.routes').then(m => m.automationRoutes),
  },
  {
    path: 'users',
    loadChildren: () =>
      import('../../../../team-management/presentation/team-management.routes').then(
        m => m.teamManagementRoutes,
      ),
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('../../../../settings/presentation/settings.routes').then(m => m.settingsRoutes),
  },
];
