import React, { useState, useEffect } from 'react';
import { X, FolderPlus, Save, GitBranch, Layers, Sparkles } from 'lucide-react';

export default function ProjectModal({ 
  isOpen, 
  onClose, 
  onSave, 
  project, 
  projects = [],
  defaultParentId = null 
}) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Web');
  const [parentId, setParentId] = useState('');
  const [branchType, setBranchType] = useState('Principal');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('EN PROCESO');
  const [statusColor, setStatusColor] = useState('#eab308');
  const [progress, setProgress] = useState(0);
  const [visualNotes, setVisualNotes] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState('MEDIA');

  useEffect(() => {
    if (project) {
      setName(project.name || '');
      setCategory(project.category || 'Web');
      setParentId(project.parent_id ? String(project.parent_id) : '');
      setBranchType(project.branch_type || 'Principal');
      setDescription(project.description || '');
      setStatus(project.status || 'EN PROCESO');
      setStatusColor(project.status_color || '#eab308');
      setProgress(project.progress || 0);
      setVisualNotes(project.visual_notes || '');
      setNotes(project.notes || '');
      setPriority(project.priority || 'MEDIA');
    } else {
      setName('');
      setCategory('Web');
      setParentId(defaultParentId ? String(defaultParentId) : '');
      setBranchType(defaultParentId ? 'Básico' : 'Principal');
      setDescription('');
      setStatus('EN PROCESO');
      setStatusColor('#eab308');
      setProgress(0);
      setVisualNotes('');
      setNotes('');
      setPriority('MEDIA');
    }
  }, [project, isOpen, defaultParentId]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      id: project?.id,
      name: name.trim(),
      parent_id: parentId ? Number(parentId) : null,
      branch_type: parentId ? branchType : 'Principal',
      category: category.trim(),
      description: description.trim(),
      status: status.trim(),
      status_color: statusColor,
      progress: Number(progress) || 0,
      visual_notes: visualNotes.trim(),
      notes: notes.trim(),
      priority,
    });
  };

  const statusPresets = [
    { label: 'LISTO', color: '#2563eb' },
    { label: 'EN PROCESO', color: '#eab308' },
    { label: 'EN PRODUCCION', color: '#9333ea' },
    { label: 'CONTRASEÑA', color: '#16a34a' },
    { label: 'TICKES', color: '#475569' },
    { label: 'NO APROBADO', color: '#dc2626' },
    { label: 'LISTO,MEJORA', color: '#ca8a04' },
  ];

  // Candidates for parent (exclude current project to avoid cycle)
  const parentCandidates = projects.filter(p => !p.parent_id && (!project || p.id !== project.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                {project ? 'Editar Proyecto / Rama' : 'Nuevo Proyecto o Sub-rama'}
              </h3>
              <p className="text-[11px] text-slate-500">Configura nombre, rama, descripción y módulos</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Sub-rama configuration */}
          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/70 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <GitBranch className="w-4 h-4 text-blue-600" />
              <span>Jerarquía / ¿Es una Sub-rama de otro proyecto?</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Proyecto Padre</label>
                <select
                  value={parentId}
                  onChange={(e) => {
                    setParentId(e.target.value);
                    if (e.target.value && branchType === 'Principal') {
                      setBranchType('Básico');
                    }
                  }}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">(Ninguno - Es Proyecto Principal)</option>
                  {parentCandidates.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              {parentId && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Tipo de Sub-rama / Nivel</label>
                  <select
                    value={branchType}
                    onChange={(e) => setBranchType(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="Básico">🌱 Versión Básica</option>
                    <option value="Avanzado">⚡ Versión Avanzada / Pro</option>
                    <option value="Complemento">🧩 Complemento / Módulo</option>
                    <option value="Móvil">📱 Versión Móvil</option>
                    <option value="Personalizado">🛠️ Personalizado / Cliente</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Nombre y Categoría */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nombre del Proyecto / Rama <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ej. PedidosWeb, SOTRACOR Avanzado..."
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Categoría</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="ej. Web, SOTRACOR..."
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Descripción Detallada */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Descripción General del Proyecto
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explica qué hace este proyecto, a qué clientes va dirigido, alcance..."
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Estado con presets rápidos */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Estado</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {statusPresets.map(preset => (
                <button
                  type="button"
                  key={preset.label}
                  onClick={() => {
                    setStatus(preset.label);
                    setStatusColor(preset.color);
                    if (preset.label === 'LISTO') setProgress(100);
                  }}
                  className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold border transition-all ${
                    status === preset.label ? 'ring-2 ring-blue-500 text-white' : 'text-slate-700 bg-slate-100 hover:bg-slate-200'
                  }`}
                  style={status === preset.label ? { backgroundColor: preset.color } : {}}
                >
                  {preset.label}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              placeholder="O escribe un estado personalizado"
              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none"
            />
          </div>

          {/* Progreso y Prioridad */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Progreso</span>
                <span className="text-blue-600 font-bold">{progress}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Prioridad</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none"
              >
                <option value="ALTA">Alta</option>
                <option value="MEDIA">Media</option>
                <option value="BAJA">Baja</option>
              </select>
            </div>
          </div>

          {/* Mejora Visual / Notas cortas de columna */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mejora Visual / Columna Corta
              </label>
              <input
                type="text"
                value={visualNotes}
                onChange={(e) => setVisualNotes(e.target.value)}
                placeholder="ej. actualizado nuevo, LISTO, 90%..."
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Notas y Recordatorios
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="ej. recordar números, nota a firma..."
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Guardar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
