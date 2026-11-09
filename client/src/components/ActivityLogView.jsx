import React, { useState } from 'react';
import { 
  Plus, 
  Calendar, 
  Clock, 
  BookOpen, 
  Trash2, 
  Edit2, 
  FolderKanban, 
  Tag, 
  CheckCircle,
  FileText
} from 'lucide-react';

export default function ActivityLogView({ 
  activities, 
  projects, 
  selectedProjectId, 
  onAddActivity, 
  onEditActivity, 
  onDeleteActivity 
}) {
  const [projectIdFilter, setProjectIdFilter] = useState(selectedProjectId || 'ALL');
  const [dateFilter, setDateFilter] = useState('');

  // Form for fast logging
  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState(selectedProjectId || (projects[0]?.id || ''));
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [hours, setHours] = useState('');
  const [details, setDetails] = useState('');
  const [type, setType] = useState('avance');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddActivity({
      title: title.trim(),
      project_id: projectId ? Number(projectId) : null,
      date: date || new Date().toISOString().split('T')[0],
      hours_spent: Number(hours) || 0,
      details: details.trim(),
      type: type || 'avance'
    });

    setTitle('');
    setDetails('');
    setHours('');
  };

  const filtered = activities.filter(a => {
    const matchesProj = projectIdFilter === 'ALL' || String(a.project_id) === String(projectIdFilter);
    const matchesDate = !dateFilter || a.date === dateFilter;
    return matchesProj && matchesDate;
  });

  const groupedByDate = filtered.reduce((groups, item) => {
    const d = item.date;
    if (!groups[d]) groups[d] = [];
    groups[d].push(item);
    return groups;
  }, {});

  const sortedDates = Object.keys(groupedByDate).sort((a, b) => b.localeCompare(a));

  const getTypeBadge = (t) => {
    switch (t) {
      case 'solucion_bug':
        return <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] px-2 py-0.5 rounded-full font-bold">🐛 Bugfix</span>;
      case 'despliegue':
        return <span className="bg-purple-50 text-purple-700 border border-purple-200 text-[10px] px-2 py-0.5 rounded-full font-bold">🚀 Despliegue</span>;
      case 'reunion':
        return <span className="bg-cyan-50 text-cyan-700 border border-cyan-200 text-[10px] px-2 py-0.5 rounded-full font-bold">👥 Reunión</span>;
      case 'nota':
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] px-2 py-0.5 rounded-full font-bold">📝 Nota</span>;
      default:
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] px-2 py-0.5 rounded-full font-bold">✨ Avance</span>;
    }
  };

  const formatDateLabel = (dStr) => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (dStr === today) return 'Hoy (' + dStr + ')';
    if (dStr === yesterday) return 'Ayer (' + dStr + ')';

    try {
      const parts = dStr.split('-');
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      return new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(d);
    } catch {
      return dStr;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Box: Registrar qué hice */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-600" />
          <span>Anotar qué hice (Bitácora de trabajo)</span>
        </h2>
        <p className="text-xs text-slate-400 mb-4">
          Control de avances diarios, tareas realizadas y horas dedicadas.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                ¿Qué hiciste? <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej. Se corrigió el bug de facturación, se desplegó a producción..."
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Proyecto</label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="">(General / Sin proyecto)</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Fecha</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 items-end">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Detalles / Notas técnicas (opcional)</label>
              <input
                type="text"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Notas, cambios en código, parámetros..."
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Horas</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  placeholder="ej. 2"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Tipo</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-2 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none"
                >
                  <option value="avance">Avance</option>
                  <option value="solucion_bug">Bugfix</option>
                  <option value="despliegue">Despliegue</option>
                  <option value="reunion">Reunión</option>
                  <option value="nota">Nota rápida</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Guardar en Bitácora</span>
            </button>
          </div>
        </form>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
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

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Calendar className="w-3.5 h-3.5" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-800 text-xs"
            />
            {dateFilter && (
              <button
                onClick={() => setDateFilter('')}
                className="text-xs text-blue-600 hover:underline"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>

        <span className="text-[11px] text-slate-400 font-medium text-right sm:text-left">
          {filtered.length} actividades
        </span>
      </div>

      {/* Daily Timeline */}
      <div className="space-y-4">
        {sortedDates.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-12 text-center shadow-xs">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-600 font-medium text-sm">No hay registros de actividades con los filtros actuales.</p>
            <p className="text-xs text-slate-400 mt-1">Usa el formulario arriba para registrar lo que hiciste.</p>
          </div>
        ) : (
          sortedDates.map((dateKey) => {
            const dayLogs = groupedByDate[dateKey];
            const dayTotalHours = dayLogs.reduce((acc, cur) => acc + (cur.hours_spent || 0), 0);

            return (
              <div key={dateKey} className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
                {/* Date header */}
                <div className="bg-white px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span className="text-xs sm:text-sm font-bold text-slate-900 capitalize">
                      {formatDateLabel(dateKey)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {dayTotalHours > 0 && (
                      <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
                        ⏱️ {dayTotalHours}h
                      </span>
                    )}
                    <span className="text-[11px] font-medium text-slate-400">
                      {dayLogs.length} reg.
                    </span>
                  </div>
                </div>

                {/* Day entries */}
                <div className="divide-y divide-slate-100 p-2">
                  {dayLogs.map((log) => (
                    <div key={log.id} className="p-3 hover:bg-slate-50/60 rounded-xl transition-colors flex items-start justify-between gap-3 group">
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap mb-1">
                          {getTypeBadge(log.type)}

                          {log.project_name && (
                            <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                              📁 {log.project_name}
                            </span>
                          )}

                          {log.hours_spent > 0 && (
                            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {log.hours_spent}h
                            </span>
                          )}
                        </div>

                        <h4 className="text-xs sm:text-sm font-semibold text-slate-900">
                          {log.title}
                        </h4>

                        {log.details && (
                          <p className="text-xs text-slate-600 mt-1 whitespace-pre-line bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                            {log.details}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEditActivity(log)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                          title="Editar"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteActivity(log.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
