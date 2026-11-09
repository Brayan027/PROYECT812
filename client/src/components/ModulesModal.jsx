import React, { useState, useEffect } from 'react';
import { X, Layers, Plus, Trash2, Edit2, CheckCircle2, Clock, Sparkles, FolderKanban } from 'lucide-react';
import { api } from '../api';

export default function ModulesModal({ isOpen, onClose, project, onModulesUpdated }) {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // New module state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('ACTIVO');
  const [editingModule, setEditingModule] = useState(null);

  const fetchModules = async () => {
    if (!project?.id) return;
    setLoading(true);
    try {
      const data = await api.getProjectModules(project.id);
      setModules(data || []);
    } catch (err) {
      console.error('Error al cargar módulos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && project?.id) {
      fetchModules();
      setName('');
      setDescription('');
      setStatus('ACTIVO');
      setEditingModule(null);
    }
  }, [isOpen, project]);

  if (!isOpen || !project) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      if (editingModule) {
        await api.updateProjectModule(editingModule.id, {
          name: name.trim(),
          description: description.trim(),
          status
        });
        setEditingModule(null);
      } else {
        await api.createProjectModule(project.id, {
          name: name.trim(),
          description: description.trim(),
          status
        });
      }
      setName('');
      setDescription('');
      setStatus('ACTIVO');
      fetchModules();
      if (onModulesUpdated) onModulesUpdated();
    } catch (err) {
      alert('Error al guardar módulo: ' + err.message);
    }
  };

  const handleEdit = (mod) => {
    setEditingModule(mod);
    setName(mod.name || '');
    setDescription(mod.description || '');
    setStatus(mod.status || 'ACTIVO');
  };

  const handleDelete = async (modId) => {
    if (window.confirm('¿Seguro que deseas eliminar este módulo?')) {
      try {
        await api.deleteProjectModule(modId);
        fetchModules();
        if (onModulesUpdated) onModulesUpdated();
      } catch (err) {
        alert('Error al eliminar módulo: ' + err.message);
      }
    }
  };

  const getStatusBadge = (st) => {
    switch (st) {
      case 'ACTIVO':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">Activo</span>;
      case 'EN_DESARROLLO':
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full">En Desarrollo</span>;
      default:
        return <span className="bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-full">Planeado</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                  Módulos de {project.name}
                </h3>
                {project.branch_type && project.branch_type !== 'Principal' && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    Rama: {project.branch_type}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Define y describe los módulos o componentes que integran este proyecto.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form to add or edit module */}
        <form onSubmit={handleSubmit} className="mt-4 p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>{editingModule ? 'Editar Módulo' : 'Nuevo Módulo'}</span>
            </h4>
            {editingModule && (
              <button
                type="button"
                onClick={() => {
                  setEditingModule(null);
                  setName('');
                  setDescription('');
                  setStatus('ACTIVO');
                }}
                className="text-xs text-slate-500 hover:underline"
              >
                Cancelar edición
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="sm:col-span-2">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre del módulo (ej. Facturación Electrónica, Menú Digital...)"
                className="w-full px-3 py-1.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none"
              >
                <option value="ACTIVO">Activo</option>
                <option value="EN_DESARROLLO">En Desarrollo</option>
                <option value="PLANEADO">Planeado / Pendiente</option>
              </select>
            </div>
          </div>

          <div>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción del módulo: ¿qué hace, qué incluye, qué tecnología o alcance tiene?..."
              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{editingModule ? 'Actualizar Módulo' : 'Agregar Módulo'}</span>
            </button>
          </div>
        </form>

        {/* Modules List */}
        <div className="flex-1 overflow-y-auto mt-4 pr-1 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Módulos existentes ({modules.length})
            </span>
          </div>

          {modules.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <Layers className="w-8 h-8 text-slate-300 mx-auto mb-1.5" />
              <p className="text-xs text-slate-500 font-medium">Este proyecto aún no tiene módulos registrados.</p>
              <p className="text-[11px] text-slate-400">Agrega el primero arriba con su nombre y descripción.</p>
            </div>
          ) : (
            modules.map((mod) => (
              <div 
                key={mod.id} 
                className="p-3 bg-white hover:bg-slate-50/70 border border-slate-200 rounded-xl transition-all shadow-xs flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 group"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h5 className="text-sm font-bold text-slate-900">{mod.name}</h5>
                    {getStatusBadge(mod.status)}
                  </div>
                  {mod.description ? (
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed whitespace-pre-line">
                      {mod.description}
                    </p>
                  ) : (
                    <p className="text-[11px] text-slate-400 italic mt-0.5">Sin descripción detallada.</p>
                  )}
                </div>

                <div className="flex items-center gap-1 self-end sm:self-start shrink-0">
                  <button
                    onClick={() => handleEdit(mod)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                    title="Editar módulo"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(mod.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Eliminar módulo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 mt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
