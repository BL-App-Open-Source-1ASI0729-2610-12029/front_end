export type AuthFailureReason = 'credentials' | 'duplicate' | 'network' | 'server';

export type AuthLoginResult =
  | { ok: true }
  | { ok: false; reason: AuthFailureReason };

export type AuthRegisterResult =
  | { ok: true; user: import('../domain/model/auth-user.entity').AuthUser }
  | { ok: false; reason: AuthFailureReason };
