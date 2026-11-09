# PROYECT812

Sistema moderno de gestión y control de proyectos, sub-ramas (versiones básicas/avanzadas), módulos con descripciones detalladas, tareas pendientes ("¿Qué debo hacer?"), bitácora de avances diarios ("¿Qué hice y en qué fecha?"), calendario interactivo y notas rápidas.

Desarrollado con **Node.js, Express y SQLite** en el backend y **React, Vite y Tailwind CSS** en el frontend.

---

## 🚀 Inicio Rápido

### 1. Clonar el repositorio
```bash
git clone https://github.com/Brayan027/PROYECT812.git
cd PROYECT812
```

### 2. Instalar dependencias
```bash
# Instalar backend
cd server
npm install

# Instalar frontend
cd ../client
npm install
npm run build
```

### 3. Iniciar el sistema
```bash
# Desde la carpeta server:
node server.js
```
O simplemente ejecuta:
```bash
iniciar.bat
```
Abre en tu navegador: **http://localhost:5000**

---

## 🌟 Características Principales

1. **Jerarquía y Sub-ramas de Proyecto:**
   - Permite organizar proyectos principales y derivar sub-ramas o variantes (ej. Versión Básica, Versión Avanzada / Pro, Complementos, Móvil).
   - Indicador visual en árbol `└─ 🌿`.

2. **Módulos por Proyecto:**
   - Define los módulos o componentes de cada proyecto con su descripción detallada y estado (*Activo*, *En Desarrollo*, *Planeado*).

3. **Control de Tareas ("¿Qué debo hacer?"):**
   - Gestión de pendientes por proyecto, prioridad (Alta, Media, Baja), fecha límite y marcado rápido.

4. **Bitácora Diaria ("Qué hice"):**
   - Registro cronológico de actividades, avances, corrección de bugs, despliegues y horas dedicadas por día.

5. **Calendario Interactivo:**
   - Vista mensual de avances y fechas de entrega con desglose por día.

6. **Notas & Recordatorios:**
   - Tablero de notas tipo post-it con colores y fijado.

---

## 🗄️ Base de Datos
- **SQLite** (`server/database.sqlite`), ligera, portable y sin necesidad de configurar servidores de base de datos externos.
