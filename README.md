# Patitas y Bigotes - Sistema de Gestión Veterinaria

Aplicación **Angular 17** orientada a demostrar operación real de una clínica veterinaria: roles, validaciones clínicas, banner de citas, accesibilidad y persistencia local.

---

## Inicio rápido

```bash
npm install
npm start        # http://localhost:4200
npm run build
npm test
```

---

## Acceso

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| `admin` | `admin123` | **Administrador** - eliminar, auditoría, respaldos, usuarios y roles |
| `asistente1` | `asist123` | **Asistente** - atención diaria, sin eliminar |
| `asistente2` | `asist123` | **Asistente** |

> Si los datos se ven desactualizados tras actualizar el proyecto: entrar como **admin** → **Datos del sistema** → **Restaurar demo**.
> Los usuarios se administran en **admin** → **Usuarios**; los creados o editados ahí pueden loguearse de inmediato.

---

## Guion de demostración (evaluador)

1. **Login** - comparar `admin` vs `asistente1` (badge de rol visible en sidebar y topbar).
2. **Banner azul** - citas de hoy/urgentes con botones Confirmar (pendientes) y Atender (confirmadas).
3. **Modo zoom** - panel **A− / A+** fijo al costado derecho (persiste al recargar).
4. **Propietario** - registrar con DNI, distrito, aceptación de datos → pantalla de éxito con **Ver ficha · Editar · Registrar mascota**.
5. **Mascota** - elegir *Propietario existente* para no duplicar dueños (referenciado por `duenoId`, sin copiar datos); probar especie **Otro** con texto libre.
6. **Cita** - intentar doble horario con el mismo veterinario → validación.
7. **Atender cita** - desde agenda, banner o dashboard (solo si está confirmada) → módulo de Atención con diagnóstico, tratamiento y medicamentos → cita pasa a Completada y el registro aparece en Historial (solo lectura).
8. **Asistente** - no ve botones eliminar ni menús Auditoría/Respaldo/Usuarios.
9. **Admin** - auditoría, exportar JSON, restaurar demo, crear/editar/desactivar usuarios.

---

## Funcionalidades destacadas

| Área | Detalle |
|------|---------|
| Roles | Matriz admin/asistente en UI + guards + directiva `*appSiPermiso` |
| Propietarios | DNI, distrito, anti-duplicado teléfono/documento, email opcional |
| Mascotas | Microchip, alergias, estado clínico, especie "otro" con texto libre, propietario existente o nuevo (FK real vía `duenoId`) |
| Citas | Banner operativo, conflictos de horario, máx. 2 citas/día, paciente fallecido, sin duplicar datos del dueño/mascota |
| Atención | Módulo dedicado: diagnóstico, tratamiento y medicamentos al atender una cita confirmada; marca la cita como Completada |
| Historial | Consulta de solo lectura del histórico clínico por mascota (creación y edición se hacen desde Atención) |
| Accesibilidad | Zoom 90-150% lateral |
| Admin | Backup JSON, importar, restaurar datos demo, gestión de Usuarios y Roles |
| Persistencia | localStorage (datos) + sessionStorage (sesión) |

---

## Arquitectura

```
src/app/
├── core/          models, services, guards, seed, normalizers
├── shared/        pipes, directivas, banner, zoom, form legend
├── layout/        sidebar, topbar, footer, shell autenticado
└── features/      dashboard, mascotas, propietarios, citas, atencion, historial, auth, admin, auditoría
```

---

## Licencia

Proyecto académico - Patitas y Bigotes.
