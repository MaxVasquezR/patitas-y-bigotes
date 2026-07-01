# Patitas y Bigotes — Sistema de Gestión Veterinaria

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
| `admin` | `admin123` | **Administrador** — eliminar, auditoría, respaldos |
| `asistente1` | `asist123` | **Asistente** — atención diaria, sin eliminar |
| `asistente2` | `asist123` | **Asistente** |

> Si los datos se ven desactualizados tras actualizar el proyecto: entrar como **admin** → **Datos del sistema** → **Restaurar demo**.

---

## Guion de demostración (evaluador)

1. **Login** — comparar `admin` vs `asistente1` (badge de rol visible en sidebar y topbar).
2. **Banner azul** — citas de hoy/urgentes con botones Confirmar y Atender.
3. **Modo zoom** — panel **A− / A+** fijo al costado derecho (persiste al recargar).
4. **Propietario** — registrar con DNI, distrito, aceptación de datos → pantalla de éxito con **Ver ficha · Editar · Registrar mascota**.
5. **Mascota** — elegir *Propietario existente* para no duplicar dueños.
6. **Cita** — intentar doble horario con el mismo veterinario → validación.
7. **Atender cita** — desde panel o banner → historial prellenado → temperatura obligatoria → cita completada.
8. **Asistente** — no ve botones eliminar ni menú Auditoría/Respaldo.
9. **Admin** — auditoría, exportar JSON, restaurar demo.

---

## Funcionalidades destacadas

| Área | Detalle |
|------|---------|
| Roles | Matriz admin/asistente en UI + guards + directiva `*appSiPermiso` |
| Propietarios | DNI, distrito, emergencia, anti-duplicado teléfono/documento |
| Mascotas | Microchip, alergias, estado clínico, propietario existente o nuevo |
| Historial | Temp. obligatoria, signos vitales, mucosas, trazabilidad creado/editado |
| Citas | Banner operativo, conflictos de horario, máx. 2 citas/día, paciente fallecido |
| Accesibilidad | Zoom 90–150% lateral |
| Admin | Backup JSON, importar, restaurar datos demo |
| Persistencia | localStorage (datos) + sessionStorage (sesión) |

---

## Arquitectura

```
src/app/
├── core/          models, services, guards, seed, normalizers
├── shared/        pipes, directivas, banner, zoom, form legend
├── layout/        sidebar, topbar, footer, shell autenticado
└── features/      dashboard, mascotas, propietarios, citas, historial, auth, admin, auditoría
```

---

## Licencia

Proyecto académico — Patitas y Bigotes.
