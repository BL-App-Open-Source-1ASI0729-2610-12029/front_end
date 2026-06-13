import { Routes } from '@angular/router';

export const deviceControlRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./presentation/pages/device-dashboard-host/device-dashboard-host.component').then(
        m => m.DeviceDashboardHostComponent,
      ),
  },
  {
    path: ':roomId/:deviceId',
    loadComponent: () =>
      import('./presentation/pages/device-detail/device-detail.component').then(
        m => m.DeviceDetailComponent,
      ),
  },
];
