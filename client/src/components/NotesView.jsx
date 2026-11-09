import React, { useState } from 'react';
import { 
  Plus, 
  Pin, 
  Trash2, 
  Edit2, 
  FolderKanban, 
  Copy, 
  Check, 
  StickyNote,
  Search
} from 'lucide-react';

export default function NotesView({ 
  notes, 
  projects, 
  selectedProjectId, 
  onAddNote, 
  onEditNote, 
  onDeleteNote,
  onTogglePin 
}) {
  const [projectIdFilter, setProjectIdFilter] = useState(selectedProjectId || 'ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // New Note state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [projectId, setProjectId] = useState(selectedProjectId || '');
  const [color, setColor] = useState('#fef08a'); // default pastel yellow

  const colors = [
    { label: 'Amarillo', hex: '#fef08a', bgClass: 'bg-amber-100/90 border-amber-300' },
    { label: 'Azul', hex: '#bfdbfe', bgClass: 'bg-blue-100/90 border-blue-300' },
    { label: 'Verde', hex: '#bbf7d0', bgClass: 'bg-emerald-100/90 border-emerald-300' },
    { label: 'Morado', hex: '#e9d5ff', bgClass: 'bg-purple-100/90 border-purple-300' },
    { label: 'Rosa', hex: '#fbcfe8', bgClass: 'bg-rose-100/90 border-rose-300' },
    { label: 'Gris', hex: '#e2e8f0', bgClass: 'bg-slate-100/90 border-slate-300' }
  ];

  const handleCreate = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    onAddNote({
      title: title.trim(),
      content: content.trim(),
      project_id: projectId ? Number(projectId) : null,
      color: color || '#fef08a',
      pinned: 0
    });

    setTitle('');
    setContent('');
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredNotes = notes.filter(n => {
    const matchesProj = projectIdFilter === 'ALL' || String(n.project_id) === String(projectIdFilter);
    const matchesSearch = !searchTerm || 
      (n.title && n.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (n.content && n.content.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesProj && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Create note box */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
          <StickyNote className="w-5 h-5 text-amber-500" />
          <span>Notas rápidas & Recordatorios</span>
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Apunta ideas, recordatorios de firma, parámetros, credenciales o notas específicas de cada proyecto.
        </p>

        <form onSubmit={handleCreate} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Título / Asunto</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="ej. Parámetros cuenta cobro, Recordatorio firma..."
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Proyecto asociado</label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              >
                <option value="">(Nota general / Sin proyecto)</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Color de la nota</label>
              <div className="flex items-center gap-2 h-9">
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
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Contenido de la nota <span className="text-red-500">*</span></label>
            <textarea
              required
              rows={2}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escribe aquí tu apunte o nota..."
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white rounded-lg text-sm font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Guardar nota</span>
            </button>
          </div>
        </form>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar en notas..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <FolderKanban className="w-3.5 h-3.5" />
            <select
              value={projectIdFilter}
              onChange={(e) => setProjectIdFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-md px-2 py-1 text-slate-800"
            >
              <option value="ALL">Todos los proyectos</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        <span className="text-xs text-slate-500 font-medium">
          {filteredNotes.length} notas guardadas
        </span>
      </div>

      {/* Sticky Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl border border-slate-200 p-12 text-center">
            <StickyNote className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-600 font-medium">No hay notas que coincidan.</p>
            <p className="text-xs text-slate-400 mt-1">Crea tu primera nota arriba para guardar recordatorios.</p>
          </div>
        ) : (
          filteredNotes.map((note) => {
            return (
              <div
                key={note.id}
                className="rounded-xl p-4 border border-slate-300/80 shadow-xs flex flex-col justify-between transition-all hover:shadow-md relative group"
                style={{ backgroundColor: note.color || '#fef08a' }}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-slate-900 text-sm">
                      {note.title || 'Nota sin título'}
                    </h3>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onTogglePin(note)}
                        className={`p-1 rounded-md transition-colors ${
                          note.pinned ? 'text-amber-700 bg-amber-200/60' : 'text-slate-400 hover:text-slate-700'
                        }`}
                        title={note.pinned ? 'Desfijar' : 'Fijar arriba'}
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleCopy(note.content, note.id)}
                        className="p-1 text-slate-500 hover:text-slate-800 rounded transition-colors"
                        title="Copiar texto"
                      >
                        {copiedId === note.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {note.project_name && (
                    <span className="inline-block text-[11px] font-semibold text-slate-700 bg-white/70 px-2 py-0.5 rounded border border-black/5 mb-2">
                      📁 {note.project_name}
                    </span>
                  )}

                  <p className="text-xs text-slate-800 whitespace-pre-line leading-relaxed font-normal">
                    {note.content}
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-black/5 flex items-center justify-between text-[11px] text-slate-600">
                  <span>{note.created_at?.slice(0, 10)}</span>
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                    <button
                      onClick={() => onEditNote(note)}
                      className="p-1 hover:bg-black/5 rounded text-slate-700"
                      title="Editar"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onDeleteNote(note.id)}
                      className="p-1 hover:bg-red-500 hover:text-white rounded text-slate-700"
                      title="Eliminar"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
