const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// ==========================================
// PROYECTOS & SUB-RAMAS
// ==========================================

// Obtener todos los proyectos con conteos de tareas, bitácora, sub-ramas y módulos
app.get('/api/projects', (req, res) => {
  try {
    const projects = db.prepare(`
      SELECT 
        p.*,
        parent.name as parent_name,
        (SELECT COUNT(*) FROM projects sub WHERE sub.parent_id = p.id) as sub_branches_count,
        (SELECT COUNT(*) FROM project_modules m WHERE m.project_id = p.id) as modules_count,
        (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id AND t.status != 'COMPLETADA') as pending_tasks,
        (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id AND t.status = 'COMPLETADA') as completed_tasks,
        (SELECT COUNT(*) FROM activity_logs a WHERE a.project_id = p.id) as log_count,
        (SELECT MAX(date) FROM activity_logs a WHERE a.project_id = p.id) as last_activity_date
      FROM projects p
      LEFT JOIN projects parent ON parent.id = p.parent_id
      ORDER BY COALESCE(p.parent_id, p.id) ASC, p.parent_id IS NOT NULL ASC, p.order_num ASC, p.id DESC
    `).all();
    res.json(projects);
  } catch (err) {
    console.error('Error al obtener proyectos:', err);
    res.status(500).json({ error: err.message });
  }
});

// Crear proyecto o sub-rama
app.post('/api/projects', (req, res) => {
  const { parent_id, branch_type, name, category, description, status, status_color, progress, visual_notes, notes, priority } = req.body;
  if (!name) return res.status(400).json({ error: 'El nombre del proyecto es obligatorio' });

  try {
    const maxOrder = db.prepare('SELECT MAX(order_num) as max_o FROM projects').get().max_o || 0;
    const stmt = db.prepare(`
      INSERT INTO projects (parent_id, branch_type, name, category, description, status, status_color, progress, visual_notes, notes, priority, order_num)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
      parent_id ? Number(parent_id) : null,
      branch_type || (parent_id ? 'Básico' : 'Principal'),
      name,
      category || 'General',
      description || '',
      status || 'EN PROCESO',
      status_color || '#eab308',
      Number(progress) || 0,
      visual_notes || '',
      notes || '',
      priority || 'MEDIA',
      maxOrder + 1
    );

    const newProject = db.prepare('SELECT * FROM projects WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(newProject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar proyecto
app.put('/api/projects/:id', (req, res) => {
  const { id } = req.params;
  const { parent_id, branch_type, name, category, description, status, status_color, progress, visual_notes, notes, priority, order_num } = req.body;

  try {
    const stmt = db.prepare(`
      UPDATE projects
      SET parent_id = ?,
          branch_type = COALESCE(?, branch_type),
          name = COALESCE(?, name),
          category = COALESCE(?, category),
          description = COALESCE(?, description),
          status = COALESCE(?, status),
          status_color = COALESCE(?, status_color),
          progress = COALESCE(?, progress),
          visual_notes = COALESCE(?, visual_notes),
          notes = COALESCE(?, notes),
          priority = COALESCE(?, priority),
          order_num = COALESCE(?, order_num),
          updated_at = datetime('now', 'localtime')
      WHERE id = ?
    `);

    stmt.run(
      parent_id !== undefined ? (parent_id ? Number(parent_id) : null) : null,
      branch_type,
      name,
      category,
      description,
      status,
      status_color,
      progress,
      visual_notes,
      notes,
      priority,
      order_num,
      id
    );
    const updated = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// MÓDULOS DE PROYECTO
// ==========================================

// Obtener módulos de un proyecto
app.get('/api/projects/:id/modules', (req, res) => {
  const { id } = req.params;
  try {
    const modules = db.prepare(`
      SELECT * FROM project_modules 
      WHERE project_id = ? 
      ORDER BY id ASC
    `).all(id);
    res.json(modules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear módulo para un proyecto
app.post('/api/projects/:id/modules', (req, res) => {
  const { id } = req.params;
  const { name, description, status } = req.body;
  if (!name) return res.status(400).json({ error: 'El nombre del módulo es obligatorio' });

  try {
    const stmt = db.prepare(`
      INSERT INTO project_modules (project_id, name, description, status)
      VALUES (?, ?, ?, ?)
    `);
    const info = stmt.run(id, name, description || '', status || 'ACTIVO');
    const newModule = db.prepare('SELECT * FROM project_modules WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(newModule);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar módulo
app.put('/api/modules/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, status } = req.body;

  try {
    const stmt = db.prepare(`
      UPDATE project_modules
      SET name = COALESCE(?, name),
          description = COALESCE(?, description),
          status = COALESCE(?, status)
      WHERE id = ?
    `);
    stmt.run(name, description, status, id);
    const updated = db.prepare('SELECT * FROM project_modules WHERE id = ?').get(id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar módulo
app.delete('/api/modules/:id', (req, res) => {
  const { id } = req.params;
  try {
    db.prepare('DELETE FROM project_modules WHERE id = ?').run(id);
    res.json({ message: 'Módulo eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar proyecto
app.delete('/api/projects/:id', (req, res) => {
  const { id } = req.params;
  try {
    db.prepare('DELETE FROM projects WHERE id = ?').run(id);
    res.json({ message: 'Proyecto eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// TAREAS (QUÉ DEBO HACER / TO-DO)
// ==========================================

// Obtener tareas con filtros opcionales
app.get('/api/tasks', (req, res) => {
  const { project_id, status, due_date } = req.query;
  try {
    let query = `
      SELECT t.*, p.name as project_name, p.status_color as project_color
      FROM tasks t
      LEFT JOIN projects p ON p.id = t.project_id
      WHERE 1=1
    `;
    const params = [];

    if (project_id) {
      query += ` AND t.project_id = ?`;
      params.push(project_id);
    }
    if (status) {
      query += ` AND t.status = ?`;
      params.push(status);
    }
    if (due_date) {
      query += ` AND t.due_date = ?`;
      params.push(due_date);
    }

    query += ` ORDER BY CASE t.status WHEN 'PENDIENTE' THEN 1 WHEN 'EN_PROCESO' THEN 2 ELSE 3 END, t.due_date ASC, t.id DESC`;

    const tasks = db.prepare(query).all(...params);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear tarea
app.post('/api/tasks', (req, res) => {
  const { project_id, title, description, due_date, priority, status } = req.body;
  if (!title) return res.status(400).json({ error: 'El título es obligatorio' });

  try {
    const stmt = db.prepare(`
      INSERT INTO tasks (project_id, title, description, due_date, priority, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
      project_id || null,
      title,
      description || '',
      due_date || null,
      priority || 'MEDIA',
      status || 'PENDIENTE'
    );
    const newTask = db.prepare(`
      SELECT t.*, p.name as project_name, p.status_color as project_color
      FROM tasks t
      LEFT JOIN projects p ON p.id = t.project_id
      WHERE t.id = ?
    `).get(info.lastInsertRowid);
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar tarea (cambio de estado, texto, etc.)
app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { project_id, title, description, due_date, priority, status } = req.body;

  try {
    let completed_at = null;
    if (status === 'COMPLETADA') {
      completed_at = new Date().toISOString();
    }

    const stmt = db.prepare(`
      UPDATE tasks
      SET project_id = COALESCE(?, project_id),
          title = COALESCE(?, title),
          description = COALESCE(?, description),
          due_date = COALESCE(?, due_date),
          priority = COALESCE(?, priority),
          status = COALESCE(?, status),
          completed_at = CASE WHEN ? = 'COMPLETADA' THEN COALESCE(completed_at, datetime('now', 'localtime')) ELSE NULL END
      WHERE id = ?
    `);

    stmt.run(project_id, title, description, due_date, priority, status, status, id);

    const updated = db.prepare(`
      SELECT t.*, p.name as project_name, p.status_color as project_color
      FROM tasks t
      LEFT JOIN projects p ON p.id = t.project_id
      WHERE t.id = ?
    `).get(id);

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar tarea
app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  try {
    db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
    res.json({ message: 'Tarea eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// BITÁCORA DE ACTIVIDADES (QUÉ HICE)
// ==========================================

// Obtener bitácora
app.get('/api/activities', (req, res) => {
  const { project_id, date, start_date, end_date } = req.query;
  try {
    let query = `
      SELECT a.*, p.name as project_name, p.status_color as project_color
      FROM activity_logs a
      LEFT JOIN projects p ON p.id = a.project_id
      WHERE 1=1
    `;
    const params = [];

    if (project_id) {
      query += ` AND a.project_id = ?`;
      params.push(project_id);
    }
    if (date) {
      query += ` AND a.date = ?`;
      params.push(date);
    }
    if (start_date && end_date) {
      query += ` AND a.date BETWEEN ? AND ?`;
      params.push(start_date, end_date);
    }

    query += ` ORDER BY a.date DESC, a.id DESC`;

    const logs = db.prepare(query).all(...params);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Registrar qué hice
app.post('/api/activities', (req, res) => {
  const { project_id, date, title, details, hours_spent, type } = req.body;
  if (!title) return res.status(400).json({ error: 'El título o resumen de la actividad es obligatorio' });

  const logDate = date || new Date().toISOString().split('T')[0];

  try {
    const stmt = db.prepare(`
      INSERT INTO activity_logs (project_id, date, title, details, hours_spent, type)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
      project_id || null,
      logDate,
      title,
      details || '',
      Number(hours_spent) || 0,
      type || 'avance'
    );

    const newLog = db.prepare(`
      SELECT a.*, p.name as project_name, p.status_color as project_color
      FROM activity_logs a
      LEFT JOIN projects p ON p.id = a.project_id
      WHERE a.id = ?
    `).get(info.lastInsertRowid);

    res.status(201).json(newLog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar registro de actividad
app.put('/api/activities/:id', (req, res) => {
  const { id } = req.params;
  const { project_id, date, title, details, hours_spent, type } = req.body;

  try {
    const stmt = db.prepare(`
      UPDATE activity_logs
      SET project_id = COALESCE(?, project_id),
          date = COALESCE(?, date),
          title = COALESCE(?, title),
          details = COALESCE(?, details),
          hours_spent = COALESCE(?, hours_spent),
          type = COALESCE(?, type)
      WHERE id = ?
    `);

    stmt.run(project_id, date, title, details, hours_spent, type, id);

    const updated = db.prepare(`
      SELECT a.*, p.name as project_name, p.status_color as project_color
      FROM activity_logs a
      LEFT JOIN projects p ON p.id = a.project_id
      WHERE a.id = ?
    `).get(id);

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar actividad
app.delete('/api/activities/:id', (req, res) => {
  const { id } = req.params;
  try {
    db.prepare('DELETE FROM activity_logs WHERE id = ?').run(id);
    res.json({ message: 'Actividad eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// CALENDARIO CONSOLIDADO
// ==========================================

app.get('/api/calendar', (req, res) => {
  const { start_date, end_date } = req.query;
  try {
    // Actividades en el rango
    let actQuery = `
      SELECT a.id, a.date, a.title, a.details, a.hours_spent, a.type, 'activity' as item_type,
             p.id as project_id, p.name as project_name, p.status_color as project_color
      FROM activity_logs a
      LEFT JOIN projects p ON p.id = a.project_id
      WHERE 1=1
    `;
    const actParams = [];
    if (start_date && end_date) {
      actQuery += ` AND a.date BETWEEN ? AND ?`;
      actParams.push(start_date, end_date);
    }
    const activities = db.prepare(actQuery).all(...actParams);

    // Tareas con fecha en el rango
    let taskQuery = `
      SELECT t.id, t.due_date as date, t.title, t.description as details, t.priority, t.status, 'task' as item_type,
             p.id as project_id, p.name as project_name, p.status_color as project_color
      FROM tasks t
      LEFT JOIN projects p ON p.id = t.project_id
      WHERE t.due_date IS NOT NULL
    `;
    const taskParams = [];
    if (start_date && end_date) {
      taskQuery += ` AND t.due_date BETWEEN ? AND ?`;
      taskParams.push(start_date, end_date);
    }
    const tasks = db.prepare(taskQuery).all(...taskParams);

    res.json({
      activities,
      tasks,
      total_activities: activities.length,
      total_tasks: tasks.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// NOTAS RÁPIDAS / RECORDATORIOS
// ==========================================

app.get('/api/notes', (req, res) => {
  try {
    const notes = db.prepare(`
      SELECT n.*, p.name as project_name, p.status_color as project_color
      FROM quick_notes n
      LEFT JOIN projects p ON p.id = n.project_id
      ORDER BY n.pinned DESC, n.updated_at DESC
    `).all();
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/notes', (req, res) => {
  const { project_id, title, content, color, pinned } = req.body;
  if (!content) return res.status(400).json({ error: 'El contenido de la nota es requerido' });

  try {
    const stmt = db.prepare(`
      INSERT INTO quick_notes (project_id, title, content, color, pinned)
      VALUES (?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
      project_id || null,
      title || '',
      content,
      color || '#fef08a',
      pinned ? 1 : 0
    );

    const note = db.prepare(`
      SELECT n.*, p.name as project_name, p.status_color as project_color
      FROM quick_notes n
      LEFT JOIN projects p ON p.id = n.project_id
      WHERE n.id = ?
    `).get(info.lastInsertRowid);

    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/notes/:id', (req, res) => {
  const { id } = req.params;
  const { project_id, title, content, color, pinned } = req.body;

  try {
    const stmt = db.prepare(`
      UPDATE quick_notes
      SET project_id = COALESCE(?, project_id),
          title = COALESCE(?, title),
          content = COALESCE(?, content),
          color = COALESCE(?, color),
          pinned = COALESCE(?, pinned),
          updated_at = datetime('now', 'localtime')
      WHERE id = ?
    `);

    stmt.run(project_id, title, content, color, pinned, id);

    const updated = db.prepare(`
      SELECT n.*, p.name as project_name, p.status_color as project_color
      FROM quick_notes n
      LEFT JOIN projects p ON p.id = n.project_id
      WHERE n.id = ?
    `).get(id);

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/notes/:id', (req, res) => {
  const { id } = req.params;
  try {
    db.prepare('DELETE FROM quick_notes WHERE id = ?').run(id);
    res.json({ message: 'Nota eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// ESTADÍSTICAS GLOBALES
// ==========================================

app.get('/api/stats', (req, res) => {
  try {
    const totalProjects = db.prepare('SELECT COUNT(*) as c FROM projects').get().c;
    const completedProjects = db.prepare("SELECT COUNT(*) as c FROM projects WHERE status = 'LISTO'").get().c;
    const inProgressProjects = db.prepare("SELECT COUNT(*) as c FROM projects WHERE status LIKE '%PROCESO%' OR status = 'EN PRODUCCION'").get().c;
    
    const pendingTasks = db.prepare("SELECT COUNT(*) as c FROM tasks WHERE status != 'COMPLETADA'").get().c;
    const completedTasks = db.prepare("SELECT COUNT(*) as c FROM tasks WHERE status = 'COMPLETADA'").get().c;

    const today = new Date().toISOString().split('T')[0];
    const todayLogs = db.prepare('SELECT COUNT(*) as c FROM activity_logs WHERE date = ?').get(today).c;
    const totalHours = db.prepare('SELECT SUM(hours_spent) as total FROM activity_logs').get().total || 0;

    res.json({
      totalProjects,
      completedProjects,
      inProgressProjects,
      pendingTasks,
      completedTasks,
      todayLogs,
      totalHours: Number(totalHours.toFixed(1))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const path = require('path');
const fs = require('fs');

const clientDist = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.use((req, res, next) => {
    if (!req.path.startsWith('/api') && req.method === 'GET') {
      return res.sendFile(path.join(clientDist, 'index.html'));
    }
    next();
  });
}

app.listen(PORT, () => {
  console.log(`Servidor activo y escuchando en el puerto ${PORT}`);
  console.log(`Accede a la aplicación en: http://localhost:${PORT}`);
});
