import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/authenticated-layout/authenticated-layout.component').then(m => m.AuthenticatedLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'mascotas',
        loadComponent: () =>
          import('./features/mascotas/lista-mascotas/lista-mascotas.component').then(m => m.ListaMascotasComponent)
      },
      {
        path: 'mascotas/nueva',
        loadComponent: () =>
          import('./features/mascotas/registro-mascota/registro-mascota.component').then(m => m.RegistroMascotaComponent)
      },
      {
        path: 'mascotas/:id/editar',
        loadComponent: () =>
          import('./features/mascotas/editar-mascota/editar-mascota.component').then(m => m.EditarMascotaComponent)
      },
      {
        path: 'mascotas/:id',
        loadComponent: () =>
          import('./features/mascotas/detalle-mascota/detalle-mascota.component').then(m => m.DetalleMascotaComponent)
      },
      {
        path: 'citas',
        loadComponent: () =>
          import('./features/citas/agenda-citas/agenda-citas.component').then(m => m.AgendaCitasComponent)
      },
      {
        path: 'citas/nueva',
        loadComponent: () =>
          import('./features/citas/nueva-cita/nueva-cita.component').then(m => m.NuevaCitaComponent)
      },
      {
        path: 'citas/:id/editar',
        loadComponent: () =>
          import('./features/citas/editar-cita/editar-cita.component').then(m => m.EditarCitaComponent)
      },
      {
        path: 'propietarios',
        loadComponent: () =>
          import('./features/propietarios/lista-propietarios/lista-propietarios.component').then(m => m.ListaPropietariosComponent)
      },
      {
        path: 'propietarios/nuevo',
        loadComponent: () =>
          import('./features/propietarios/registro-propietario/registro-propietario.component').then(m => m.RegistroPropietarioComponent)
      },
      {
        path: 'propietarios/:id/editar',
        loadComponent: () =>
          import('./features/propietarios/editar-propietario/editar-propietario.component').then(m => m.EditarPropietarioComponent)
      },
      {
        path: 'propietarios/:id',
        loadComponent: () =>
          import('./features/propietarios/detalle-propietario/detalle-propietario.component').then(m => m.DetallePropietarioComponent)
      },
      {
        path: 'historial/:id',
        loadComponent: () =>
          import('./features/historial/historial-mascota/historial-mascota.component').then(m => m.HistorialMascotaComponent)
      },
      {
        path: 'atencion/:citaId',
        loadComponent: () =>
          import('./features/atencion/atender-cita/atender-cita.component').then(m => m.AtenderCitaComponent)
      },
      {
        path: 'auditoria',
        canActivate: [roleGuard('admin')],
        loadComponent: () =>
          import('./features/auditoria/auditoria.component').then(m => m.AuditoriaComponent)
      },
      {
        path: 'admin/datos',
        canActivate: [roleGuard('admin')],
        loadComponent: () =>
          import('./features/admin/admin-datos/admin-datos.component').then(m => m.AdminDatosComponent)
      },
      {
        path: 'usuarios',
        canActivate: [roleGuard('admin')],
        loadComponent: () =>
          import('./features/admin/usuarios/lista-usuarios/lista-usuarios.component').then(m => m.ListaUsuariosComponent)
      },
      {
        path: 'usuarios/nuevo',
        canActivate: [roleGuard('admin')],
        loadComponent: () =>
          import('./features/admin/usuarios/registro-usuario/registro-usuario.component').then(m => m.RegistroUsuarioComponent)
      },
      {
        path: 'usuarios/:id/editar',
        canActivate: [roleGuard('admin')],
        loadComponent: () =>
          import('./features/admin/usuarios/editar-usuario/editar-usuario.component').then(m => m.EditarUsuarioComponent)
      }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
