import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { AuthService } from './auth.service';

export const isSmartHomeAccount: CanMatchFn = () =>
  inject(AuthService).getAccountType() !== 'small-business';

export const isSmallBusinessAccount: CanMatchFn = () =>
  inject(AuthService).getAccountType() === 'small-business';
