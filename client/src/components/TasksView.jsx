import React, { useState } from 'react';
import { 
  Plus, 
  CheckCircle2, 
  Calendar, 
  Trash2, 
  Edit2, 
  FolderKanban,
  Check,
  Sparkles
} from 'lucide-react';

export default function TasksView({ 
  tasks, 
  projects, 
  selectedProjectId, 
  onToggleStatus, 
  onAddTask, 
  onEditTask, 
  onDeleteTask 
}) {
  const [projectIdFilter, setProjectIdFilter] = useState(selectedProjectId || 'ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  // Quick inline add state
  const [newTitle, setNewTitle] = useState('');
  const [newProjectId, setNewProjectId] = useState(selectedProjectId || (projects[0]?.id || ''));
  const [newDueDate, setNewDueDate] = useState('');
  const [newPriority, setNewPriority] = useState('MEDIA');

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTask({
      title: newTitle.trim(),
      project_id: newProjectId ? Number(newProjectId) : null,
      due_date: newDueDate || null,
      priority: newPriority,
      status: 'PENDIENTE'
    });

    setNewTitle('');
  };

  const filteredTasks = tasks.filter(t => {
    const matchesProj = projectIdFilter === 'ALL' || String(t.project_id) === String(projectIdFilter);
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
    return matchesProj && matchesStatus && matchesPriority;
  });

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'ALTA':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">ALTA</span>;
      case 'MEDIA':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">MEDIA</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-50 text-slate-600 border border-slate-200">BAJA</span>;
    }
  };

  const getDueDateLabel = (dateStr) => {
    if (!dateStr) return null;
    const today = new Date().toISOString().split('T')[0];
    const isToday = dateStr === today;
    const isPast = dateStr < today;

    return (
      <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md font-medium ${
        isPast 
          ? 'bg-rose-50 text-rose-700 border border-rose-200 font-semibold' 
          : isToday 
            ? 'bg-amber-50 text-amber-700 border border-amber-200 font-semibold' 
            : 'bg-slate-50 text-slate-600 border border-slate-200'
      }`}>
        <Calendar className="w-3 h-3" />
        {isPast ? `Vencida (${dateStr})` : isToday ? 'Para Hoy' : dateStr}
      </span>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header and Quick Add Box */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span>¿Qué debo hacer?</span>
            <span className="text-xs bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full border border-blue-200">
              {tasks.filter(t => t.status !== 'COMPLETADA').length} pendientes
            </span>
          </span>
        </h2>

        {/* Responsive Inline Fast Form */}
        <form onSubmit={handleQuickAdd} className="flex flex-col md:flex-row gap-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Escribe lo que debes hacer... (ej. Corregir validación en login, Enviar informe...)"
            className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />

          <div className="grid grid-cols-2 sm:flex items-center gap-2">
            <select
              value={newProjectId}
              onChange={(e) => setNewProjectId(e.target.value)}
              className="text-xs bg-white border border-slate-200 rounded-xl px-2.5 py-2 focus:outline-none"
            >
              <option value="">(Sin proyecto)</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            <input
              type="date"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              className="text-xs bg-white border border-slate-200 rounded-xl px-2.5 py-2 focus:outline-none"
              title="Fecha límite"
            />

            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value)}
              className="text-xs bg-white border border-slate-200 rounded-xl px-2.5 py-2 focus:outline-none"
            >
              <option value="ALTA">Alta</option>
              <option value="MEDIA">Media</option>
              <option value="BAJA">Baja</option>
            </select>

            <button
              type="submit"
              className="col-span-2 sm:col-span-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar</span>
            </button>
          </div>
        </form>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Project filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <FolderKanban className="w-3.5 h-3.5" />
            <select
              value={projectIdFilter}
              onChange={(e) => setProjectIdFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-800 text-xs"
            >
              <option value="ALL">Todos los proyectos</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Estado:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-800 text-xs"
            >
              <option value="ALL">Todos</option>
              <option value="PENDIENTE">Pendientes</option>
              <option value="EN_PROCESO">En Proceso</option>
              <option value="COMPLETADA">Completadas</option>
            </select>
          </div>

          {/* Priority filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Prioridad:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-800 text-xs"
            >
              <option value="ALL">Todas</option>
              <option value="ALTA">Alta</option>
              <option value="MEDIA">Media</option>
              <option value="BAJA">Baja</option>
            </select>
          </div>
        </div>

        <span className="text-[11px] text-slate-400 font-medium text-right sm:text-left">
          {filteredTasks.length} tareas
        </span>
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-12 text-center shadow-xs">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-50" />
            <p className="text-slate-600 font-medium text-sm">¡No hay tareas pendientes en este filtro!</p>
            <p className="text-xs text-slate-400 mt-1">Usa el formulario arriba para agregar lo que tienes pendiente.</p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isCompleted = task.status === 'COMPLETADA';
            const isInProgress = task.status === 'EN_PROCESO';

            return (
              <div
                key={task.id}
                className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all ${
                  isCompleted 
                    ? 'bg-slate-50/60 border-slate-100 opacity-60' 
                    : isInProgress
                      ? 'bg-amber-50/20 border-amber-200 shadow-xs'
                      : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-xs'
                }`}
              >
                {/* Complete checkbox button */}
                <button
                  onClick={() => onToggleStatus(task)}
                  className={`mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'border-2 border-slate-300 hover:border-blue-500 text-transparent hover:text-blue-500'
                  }`}
                  title={isCompleted ? 'Marcar como pendiente' : 'Marcar como completada'}
                >
                  <Check className="w-3.5 h-3.5" />
                </button>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`text-xs sm:text-sm font-semibold ${isCompleted ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                      {task.title}
                    </span>

                    {getPriorityBadge(task.priority)}

                    {task.project_name && (
                      <span className="text-[10px] font-semibold text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                        📁 {task.project_name}
                      </span>
                    )}

                    {task.due_date && getDueDateLabel(task.due_date)}
                  </div>

                  {task.description && (
                    <p className={`text-xs mt-1 ${isCompleted ? 'text-slate-400' : 'text-slate-500'}`}>
                      {task.description}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => onEditTask(task)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                    title="Editar"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                    title="Eliminar"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
