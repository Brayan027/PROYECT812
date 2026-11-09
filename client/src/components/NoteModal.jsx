import React, { useState, useEffect } from 'react';
import { X, StickyNote, Save } from 'lucide-react';

export default function NoteModal({ isOpen, onClose, onSave, note, projects }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [projectId, setProjectId] = useState('');
  const [color, setColor] = useState('#fef08a');

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
      setProjectId(note.project_id || '');
      setColor(note.color || '#fef08a');
    } else {
      setTitle('');
      setContent('');
      setProjectId('');
      setColor('#fef08a');
    }
  }, [note, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    onSave({
      id: note?.id,
      title: title.trim(),
      content: content.trim(),
      project_id: projectId ? Number(projectId) : null,
      color,
      pinned: note?.pinned || 0
    });
  };

  const colors = [
    { label: 'Amarillo', hex: '#fef08a' },
    { label: 'Azul', hex: '#bfdbfe' },
    { label: 'Verde', hex: '#bbf7d0' },
    { label: 'Morado', hex: '#e9d5ff' },
    { label: 'Rosa', hex: '#fbcfe8' },
    { label: 'Gris', hex: '#e2e8f0' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <StickyNote className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">
              {note ? 'Editar Nota' : 'Nueva Nota'}
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
            <label className="block text-xs font-semibold text-slate-700 mb-1">Título / Asunto</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ej. Notas de reunión, parámetros cuenta cobro..."
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Proyecto asociado</label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            >
              <option value="">(Sin proyecto específico / General)</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Color</label>
            <div className="flex items-center gap-2">
              {colors.map(c => (
                <button
                  type="button"
                  key={c.hex}
                  onClick={() => setColor(c.hex)}
                  className={`w-7 h-7 rounded-full border-2 transition-transform ${
                    color === c.hex ? 'scale-110 border-slate-800 shadow-sm' : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Contenido <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escribe aquí los apuntes..."
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
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
              className="px-5 py-2 text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 rounded-lg flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Nota</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
