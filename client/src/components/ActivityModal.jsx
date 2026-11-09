import React, { useState, useEffect } from 'react';
import { X, Clock, Save, Sparkles } from 'lucide-react';

export default function ActivityModal({ 
  isOpen, 
  onClose, 
  onSave, 
  activity, 
  projects, 
  defaultDate, 
  defaultProjectId 
}) {
  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState('');
  const [date, setDate] = useState('');
  const [hoursSpent, setHoursSpent] = useState('');
  const [details, setDetails] = useState('');
  const [type, setType] = useState('avance');

  useEffect(() => {
    if (activity) {
      setTitle(activity.title || '');
      setProjectId(activity.project_id || '');
      setDate(activity.date || '');
      setHoursSpent(activity.hours_spent || '');
      setDetails(activity.details || '');
      setType(activity.type || 'avance');
    } else {
      setTitle('');
      setProjectId(defaultProjectId || (projects[0]?.id || ''));
      setDate(defaultDate || new Date().toISOString().split('T')[0]);
      setHoursSpent('');
      setDetails('');
      setType('avance');
    }
  }, [activity, isOpen, defaultDate, defaultProjectId, projects]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      id: activity?.id,
      title: title.trim(),
      project_id: projectId ? Number(projectId) : null,
      date: date || new Date().toISOString().split('T')[0],
      hours_spent: Number(hoursSpent) || 0,
      details: details.trim(),
      type
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">
              {activity ? 'Editar Registro' : 'Anotar qué hice'}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ¿Qué hiciste? (Resumen) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ej. Ajustes en cuenta de cobro, despliegue a producción..."
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Proyecto</label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="">(General / Sin proyecto)</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Fecha</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Horas dedicadas</label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={hoursSpent}
                onChange={(e) => setHoursSpent(e.target.value)}
                placeholder="ej. 2.5"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tipo de Actividad</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none"
            >
              <option value="avance">✨ Avance general</option>
              <option value="solucion_bug">🐛 Corrección de Bug / Error</option>
              <option value="despliegue">🚀 Despliegue / Pase a Producción</option>
              <option value="reunion">👥 Reunión / Llamada con cliente</option>
              <option value="nota">📝 Nota / Revisión</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Detalles / Explicación adicional</label>
            <textarea
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Escribe detalles de lo que hiciste, problemas encontrados, o notas técnicas..."
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Guardar en Bitácora</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
