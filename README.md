# DomotiCore - Frontend

DomotiCore es una aplicación web frontend desarrollada en Angular para la gestión de domótica, seguridad e integraciones inteligentes. Ofrece **dos experiencias** según el tipo de cuenta:

- **Hogares Inteligentes** — panel residencial con dashboard, seguridad, dispositivos, automatización e historial.
- **Pequeños Negocios y Emprendedores** — hub operativo, gestión de dispositivos, reportes, integraciones, automatización y equipo.

Tras el login, un **asistente de onboarding** permite elegir el tipo de cuenta y personalizar la navegación. La selección queda **persistida** en el repositorio local de usuarios para que no se repita en futuros accesos.

## Características Principales

### Identidad y Acceso (IAM)
- Login, registro y cierre de sesión
- Guards de autenticación y onboarding
- Selección de tipo de cuenta (`smart-home` | `small-business`)
- Layouts especializados por perfil (shell de hogar vs. negocio)
- Persistencia de `accountType` y `onboardingCompleted` en sesión y repositorio

### Hogares Inteligentes
- **Dashboard** — resumen del hogar y métricas clave
- **Seguridad** — cámaras, cerraduras inteligentes, usuarios autorizados y registro de accesos
- **Dispositivos** — panel por habitaciones y detalle por dispositivo (clima, consumo, modos)
- **Automatización** — centro de reglas, configuración de zonas y constructor visual
- **Historial** — notificaciones, actividad y análisis energético
- **Configuración** — preferencias de usuario y apariencia

### Pequeños Negocios
- **Hub de operaciones** — vista central del negocio (KPIs, mapa, sostenibilidad)
- **Dispositivos** — gestión empresarial y explorador de dispositivos
- **Reportes** — comparativos, análisis de costos e historial de alertas
- **Integraciones inteligentes** — servicios conectados, sincronización y perfil/API
- **Automatización** — timeline, reglas operativas y horarios por grupo
- **Usuarios** — gestión de equipo y perfil de negocio
- **Configuración** — ajustes compartidos con el perfil residencial

### Experiencia compartida
- **Internacionalización** — español e inglés (`@ngx-translate`)
- **Tema claro/oscuro** — persistido en `localStorage`, integrado con Angular Material M3
- **Datos híbridos** — API local con fallback automático a mock estático
- **Componentes reutilizables** — sidebars, overlays, toolbar y switcher de idioma
- **Feedback de UI** — notificaciones con `MatSnackBar` vía `UiFeedbackService`

## Arquitectura

El proyecto sigue **Bounded Contexts** (contextos acotados) con capas `domain`, `application`, `infrastructure` y `presentation` en la raíz de `src/`:

```
src/
├── iam/                    # Autenticación, onboarding y shells por tipo de cuenta
├── dashboard/              # Panel principal (Smart Home)
├── security/               # Seguridad y accesos
├── device-control/         # Dispositivos (hogar y negocio)
├── automation/             # Reglas, zonas y builder
├── history/                # Notificaciones, actividad, energía y reportes
├── smart-integrations/     # Integraciones y perfil API (negocio)
├── sme-operations-hub/     # Hub operativo (negocio)
├── team-management/        # Equipo y perfil empresarial
├── settings/               # Configuración global
├── shared/                 # Servicios, componentes, layouts, Material barrel y utilidades
│   ├── layouts/            # Shells de router (auth-layout)
│   └── material/           # MATERIAL_IMPORTS (barrel de módulos Material)
├── material-theme.scss     # Tema M3 (claro/oscuro)
├── material-layout-fixes.css  # Overrides para layouts custom + Material
├── assets/                 # i18n, iconos (smart-home/, small-business/, shared/)
└── environments/           # Configuración de API
```

Cada contexto expone sus rutas de forma lazy-loaded desde `app.routes.ts` y los shells correspondientes.

## Contextos acotados

| Contexto | Descripción |
| --- | --- |
| IAM | Login, registro, onboarding y protección de rutas |
| Dashboard | Resumen y estadísticas del hogar |
| Security | Cámaras, cerraduras, usuarios autorizados y logs |
| Device Control | Control y exploración de dispositivos |
| Automation | Centro de automatización, zonas y builder |
| History | Notificaciones, actividad, energía y reportes empresariales |
| Smart Integrations | Integraciones, servicios conectados y API |
| SME Operations Hub | Panel operativo para pequeños negocios |
| Team Management | Usuarios del equipo y perfil de negocio |
| Settings | Preferencias, idioma y tema |

## Tecnologías

| Tecnología | Uso en el proyecto |
| --- | --- |
| **Angular 21** | Standalone components, signals, lazy loading |
| **TypeScript 5.9** | Tipado estricto en dominio, stores e infraestructura |
| **HTML5 + CSS3** | Layouts con Grid/Flexbox, variables CSS, estilos por componente |
| **Angular Material 21** | Botones, formularios, cards, tablas, tabs, snackbar, sidenav, chips, dialogs, ripple |
| **Material Design 3** | Tema personalizado (`#3455d1`), Roboto, Material Icons |
| **@ngx-translate** | i18n (es / en) |
| **RxJS 7** | Flujos asíncronos en servicios y stores |
| **Vitest** | Pruebas unitarias |
| **Client hydration** | `provideClientHydration(withEventReplay())` |

### Integración Angular Material

La app usa un enfoque **híbrido** que cumple la rúbrica de Material Design sin sacrificar layouts complejos:

- **`src/material-theme.scss`** — tema M3 con paleta primaria `#3455d1`, soporte claro/oscuro vía `html[data-theme='dark']`.
- **`src/shared/material/index.ts`** — barrel `MATERIAL_IMPORTS` para importar módulos Material en componentes standalone.
- **`src/material-layout-fixes.css`** — correcciones globales cuando un control custom (tarjetas, chips, timeline) no debe usar `mat-stroked-button` por conflictos de layout.
- **`src/styles.css`** — estilos compartidos para auth, cards, snackbars y formularios outline.

**Patrón recomendado en el proyecto:**

| Caso | Componente Material |
| --- | --- |
| Botones estándar, modales, tabs | `mat-flat-button`, `mat-stroked-button`, `mat-button` |
| Formularios | `mat-form-field appearance="outline"` + `matInput` / `mat-select` |
| Tarjetas con layout custom (grid, absolute, badges) | `<button matRipple class="...">` en lugar de `mat-stroked-button` |
| Feedback al usuario | `MatSnackBar` (`UiFeedbackService`) |
| Navegación / layout | `mat-card`, `mat-sidenav`, `mat-toolbar`, `mat-icon-button` |

> **Nota:** La landing page pública puede vivir en un proyecto separado; este repositorio contiene la aplicación autenticada (panel DomotiCore).

## Instalación

### Prerrequisitos

- Node.js 18+
- npm 10+ (el proyecto fija `npm@10.9.3` como package manager)

### Pasos

1. Clona el repositorio e ingresa al directorio de la app:

```bash
git clone <url-del-repositorio>
cd Veltrix-DomotiCore-Front-End/DomotiCore
```

2. Instala dependencias:

```bash
npm install
```

3. Inicia el servidor de desarrollo:

```bash
npm start
```

4. Abre `http://localhost:4200`

### Scripts disponibles

| Script | Descripción |
| --- | --- |
| `npm start` | Servidor de desarrollo (`ng serve`) |
| `npm run build` | Build de producción |
| `npm run build:vercel` | Genera env, exporta mock data y compila para Vercel |
| `npm run export-mock-data` | Exporta `data/db.json` → `public/mock-data/` |
| `npm test` | Ejecuta pruebas con Vitest |
| `npm run watch` | Build en modo watch (development) |

## API local

En desarrollo la app apunta al backend Spring Boot en `http://localhost:8080/api/v1` (`src/environments/environment.ts`).

Si `apiUrl` está vacío, la app usa únicamente los JSON estáticos en `public/mock-data/` (ideal para Vercel y demos sin backend).

Los datos de prueba se mantienen en `data/db.json` y se exportan a `public/mock-data/` con `npm run export-mock-data`.

El servicio `ApiClientService` intenta la API primero y hace **fallback automático** a mock data si la petición falla.

## Despliegue en Vercel

1. Importa el repositorio en [Vercel](https://vercel.com).
2. **Root Directory**: `DomotiCore`
3. **Build Command**: `npm run build:vercel` (configurado en `vercel.json`)
4. **Output Directory**: `dist/domoticore/browser`

La build de Vercel ejecuta:

- `scripts/generate-env.js` — inyecta `NG_APP_API_URL` en `environment.production.ts`
- `scripts/export-mock-data.js` — sincroniza mock data desde `data/db.json`
- `ng build` — compilación estática

### Conectar API externa (opcional)

En Vercel → Settings → Environment Variables:

```
NG_APP_API_URL=https://tu-api.com/api/v1
```

Si no se define, la app funciona solo con datos estáticos.

| Área | Sin API (Vercel) | Con API (local) |
| --- | --- | --- |
| Login / registro | ✅ mock + caché local | ✅ Spring Boot |
| Dispositivos | ✅ | ✅ lectura/escritura |
| Seguridad | ✅ | ✅ |
| Historial / reportes | ✅ | ✅ |
| Automatización | ✅ | ✅ |
| Dashboard / settings | ✅ | ✅ |

## Estructura de rutas

### Autenticación

| Ruta | Descripción |
| --- | --- |
| `/auth/login` | Inicio de sesión |
| `/auth/register` | Registro |
| `/auth/onboarding` | Asistente de tipo de cuenta (post-login) |

### Hogares Inteligentes (`/app/...`)

| Ruta | Descripción |
| --- | --- |
| `/app/dashboard` | Panel principal |
| `/app/security` | Seguridad y accesos |
| `/app/devices` | Dispositivos por habitación |
| `/app/devices/:roomId/:deviceId` | Detalle de dispositivo |
| `/app/automation/center` | Centro de automatización |
| `/app/automation/zones` | Configuración de zonas |
| `/app/automation/builder` | Constructor de reglas |
| `/app/history/notifications` | Centro de notificaciones |
| `/app/history/activity` | Registro de actividad |
| `/app/history/energy` | Inteligencia energética |
| `/app/settings` | Configuración |

### Pequeños Negocios (`/app/...`)

| Ruta | Descripción |
| --- | --- |
| `/app/operations-hub` | Hub operativo |
| `/app/devices/management` | Gestión de dispositivos |
| `/app/devices/explorer` | Explorador de dispositivos |
| `/app/devices/:roomId/:deviceId` | Detalle de dispositivo |
| `/app/reports/comparative` | Reportes comparativos |
| `/app/reports/cost-analysis` | Análisis de costos |
| `/app/reports/alerts-history` | Historial de alertas |
| `/app/smart-integrations/integrations` | Integraciones |
| `/app/smart-integrations/connected-services` | Servicios conectados |
| `/app/smart-integrations/sync-status` | Estado de sincronización |
| `/app/smart-integrations/business-profile-api-settings` | Perfil y API |
| `/app/automation/center` | Centro de automatización |
| `/app/automation/zones` | Configuración de zonas |
| `/app/automation/builder` | Constructor de reglas |
| `/app/users/team` | Gestión de equipo |
| `/app/users/business-profile` | Perfil de negocio |
| `/app/settings` | Configuración |

> Tras el login, la app redirige a `/app/dashboard` (hogar) o `/app/operations-hub` (negocio) según el tipo de cuenta elegido en onboarding.

## Internacionalización

Traducciones en `src/assets/i18n/es.json` y `en.json`. El idioma por defecto es **español**; si el navegador está en inglés, se selecciona automáticamente. También puedes cambiarlo desde Configuración.

Claves i18n relevantes añadidas o corregidas recientemente:
- `automation.overtimeTypes.*` — etiquetas completas en horarios por grupo
- `zoneConfiguration.schedule.overtime.*` — reglas overtime en configuración de zonas
- Textos de Business Profile, Automation Builder y Device Detail

## Credenciales de prueba

- **Email:** `admin@domoticore.local`
- **Password:** `SecurePass123`

También puedes registrarte con una cuenta nueva. Tras el primer acceso, completa el onboarding para elegir el tipo de cuenta.

## Mejoras recientes de UI/UX

Correcciones aplicadas durante la migración a Angular Material:

| Área | Problema resuelto |
| --- | --- |
| Auth / onboarding | Layout de login, registro y wizard de segmento |
| Operations Hub | Tarjeta de sostenibilidad y zonas del mapa |
| Automation Center | Tarjeta "New Scenario", badges de horarios, timeline |
| Automation Builder | Selección de triggers/acciones (bordes y checkmarks) |
| Device Detail | Botones de modo, stats, timer; flecha de retroceso |
| Business Profile | Formularios outline, headers de tarjetas, botones dashed |
| Settings | Footer "Save All Changes" superpuesto, display mode |

## Convenciones de código

- Componentes standalone con imports explícitos (`MATERIAL_IMPORTS` donde aplique)
- Separación por capas dentro de cada bounded context
- Stores en `application/` para estado de UI
- Servicios API en `infrastructure/` con ensambladores de respuesta
- Estilos modulares por componente (CSS) + tema Material global (SCSS)
- Lazy loading de rutas y componentes
- No usar `mat-stroked-button` en controles con layout tipo tarjeta/grid; preferir `matRipple`
- No aplicar clases de formulario legacy (`.form-group` con flex) sobre `mat-form-field`

## Cumplimiento de rúbrica (frontend)

| Requisito | Estado |
| --- | --- |
| Angular + TypeScript | ✅ |
| HTML5 + CSS3 | ✅ |
| Material Design / Angular Material | ✅ (híbrido: Material + layouts custom con `matRipple`) |

## Contribución

1. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
2. Realiza tus cambios y commits
3. Push: `git push origin feature/nueva-funcionalidad`
4. Abre un Pull Request

## Recursos adicionales

- [Angular CLI — Overview and Command Reference](https://angular.dev/tools/cli)
- [Angular Material](https://material.angular.dev/)
- [Material Design 3](https://m3.material.io/)
