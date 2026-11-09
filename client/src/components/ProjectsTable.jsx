import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Plus, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ListTodo,
  BookOpen,
  GitBranch,
  Layers,
  ChevronDown,
  Info
} from 'lucide-react';

export default function ProjectsTable({ 
  projects, 
  onEditProject, 
  onDeleteProject, 
  onQuickAddActivity, 
  onQuickAddTask,
  onSelectProject,
  onOpenModules,
  onAddSubBranch
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [expandedMobile, setExpandedMobile] = useState({});

  // Categories list
  const categories = ['ALL', ...new Set(projects.map(p => p.category).filter(Boolean))];

  // Organize hierarchical projects (parents first, then their sub-branches)
  const parents = projects.filter(p => !p.parent_id);
  const subBranchesByParent = projects.reduce((acc, p) => {
    if (p.parent_id) {
      if (!acc[p.parent_id]) acc[p.parent_id] = [];
      acc[p.parent_id].push(p);
    }
    return acc;
  }, {});

  // Flatten keeping parent -> sub-branch order
  const orderedProjects = [];
  parents.forEach(parent => {
    orderedProjects.push(parent);
    if (subBranchesByParent[parent.id]) {
      orderedProjects.push(...subBranchesByParent[parent.id]);
    }
  });

  // Also include any orphan sub-branches if any
  const orphanSubBranches = projects.filter(p => p.parent_id && !parents.find(par => par.id === p.parent_id));
  orderedProjects.push(...orphanSubBranches);

  // Filtered projects
  const filtered = orderedProjects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (p.notes && p.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (p.visual_notes && p.visual_notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    const matchesCategory = categoryFilter === 'ALL' || p.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusBadgeStyle = (status) => {
    const s = (status || '').toUpperCase();
    if (s.includes('LISTO')) {
      return 'bg-blue-50 text-blue-700 border-blue-200';
    }
    if (s.includes('PRODUCCION') || s.includes('PRODUCCIÓN')) {
      return 'bg-purple-50 text-purple-700 border-purple-200';
    }
    if (s.includes('PROCESO')) {
      return 'bg-amber-50 text-amber-700 border-amber-200';
    }
    if (s.includes('CONTRASEÑA')) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    if (s.includes('NO APROBADO') || s.includes('ERROR')) {
      return 'bg-rose-50 text-rose-700 border-rose-200';
    }
    if (s.includes('TICKET') || s.includes('TICKES')) {
      return 'bg-slate-100 text-slate-700 border-slate-200';
    }
    return 'bg-slate-50 text-slate-700 border-slate-200';
  };

  const getBranchBadge = (type) => {
    switch (type) {
      case 'Avanzado':
        return <span className="bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold px-1.5 py-0.5 rounded">⚡ Avanzado</span>;
      case 'Básico':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-1.5 py-0.5 rounded">🌱 Básico</span>;
      case 'Complemento':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold px-1.5 py-0.5 rounded">🧩 Complemento</span>;
      case 'Móvil':
        return <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold px-1.5 py-0.5 rounded">📱 Móvil</span>;
      default:
        return <span className="bg-slate-50 text-slate-600 border border-slate-200 text-[10px] font-medium px-1.5 py-0.5 rounded">{type}</span>;
    }
  };

  const toggleMobileExpand = (id) => {
    setExpandedMobile(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      {/* Top filters bar */}
      <div className="p-3.5 sm:p-4 border-b border-slate-100 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-white">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar proyectos, módulos, notas..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-500 font-medium">Categoría:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {categories.map(c => (
                <option key={c} value={c}>{c === 'ALL' ? 'Todas' : c}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-500 font-medium">Estado:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="ALL">Todos</option>
              <option value="LISTO">LISTO</option>
              <option value="EN PROCESO">EN PROCESO</option>
              <option value="EN PRODUCCION">EN PRODUCCIÓN</option>
              <option value="CONTRASEÑA">CONTRASEÑA</option>
              <option value="TICKES">TICKES</option>
              <option value="NO APROBADO">NO APROBADO</option>
            </select>
          </div>

          <span className="text-xs font-semibold text-slate-400 ml-auto">
            {filtered.length} proyectos
          </span>
        </div>
      </div>

      {/* DESKTOP TABLE VIEW (Visible on md and up) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-white text-slate-500 text-[11px] font-bold uppercase tracking-wider">
              <th className="py-3 px-4 w-12 text-center">#</th>
              <th className="py-3 px-4">Proyecto / Sub-rama</th>
              <th className="py-3 px-3">Estado</th>
              <th className="py-3 px-3">Progreso</th>
              <th className="py-3 px-3 text-center">Módulos</th>
              <th className="py-3 px-3">Mejora Visual / Notas</th>
              <th className="py-3 px-3 text-center">Tareas</th>
              <th className="py-3 px-3 text-center">Bitácora</th>
              <th className="py-3 px-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400">
                  No se encontraron proyectos con los filtros aplicados.
                </td>
              </tr>
            ) : (
              filtered.map((project, index) => {
                const isSubBranch = !!project.parent_id;

                return (
                  <tr 
                    key={project.id} 
                    className={`transition-colors group ${isSubBranch ? 'bg-slate-50/40 hover:bg-slate-100/60' : 'bg-white hover:bg-blue-50/20'}`}
                  >
                    {/* # */}
                    <td className="py-3 px-4 text-center font-mono text-xs text-slate-300">
                      {project.order_num || index + 1}
                    </td>

                    {/* Nombre y Jerarquía */}
                    <td className="py-3 px-4">
                      <div className={`flex flex-col ${isSubBranch ? 'pl-5 relative' : ''}`}>
                        {isSubBranch && (
                          <div className="absolute left-0 top-1 text-slate-400 flex items-center">
                            <span className="text-slate-300 mr-1">└─</span>
                            <GitBranch className="w-3.5 h-3.5 text-blue-500" />
                          </div>
                        )}

                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`font-semibold transition-colors ${
                            isSubBranch ? 'text-slate-700 text-xs' : 'text-slate-900 group-hover:text-blue-600'
                          }`}>
                            {project.name}
                          </span>

                          {isSubBranch && getBranchBadge(project.branch_type)}

                          {project.category && (
                            <span className="text-[10px] text-slate-400 font-medium">
                              • {project.category}
                            </span>
                          )}

                          {!isSubBranch && project.sub_branches_count > 0 && (
                            <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.2 rounded-full">
                              {project.sub_branches_count} sub-ramas
                            </span>
                          )}
                        </div>

                        {project.description && (
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                            {project.description}
                          </p>
                        )}

                        {project.notes && (
                          <p className="text-[11px] text-amber-800 mt-1 italic line-clamp-1 max-w-sm bg-amber-50/70 border border-amber-200/50 rounded px-1.5 py-0.5">
                            📌 {project.notes}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Estado */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold border uppercase tracking-wider ${getStatusBadgeStyle(project.status)}`}>
                        {project.status}
                      </span>
                    </td>

                    {/* Progreso */}
                    <td className="py-3 px-3 min-w-[110px]">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              project.progress >= 100 
                                ? 'bg-blue-600' 
                                : project.progress >= 50 
                                  ? 'bg-amber-500' 
                                  : 'bg-slate-400'
                            }`}
                            style={{ width: `${Math.min(100, Math.max(0, project.progress || 0))}%` }}
                          ></div>
                        </div>
                        <span className="text-[11px] font-semibold text-slate-500 w-7 text-right">
                          {project.progress || 0}%
                        </span>
                      </div>
                    </td>

                    {/* Módulos */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <button
                        onClick={() => onOpenModules(project)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors border ${
                          (project.modules_count || 0) > 0
                            ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                            : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                        }`}
                        title="Ver y configurar los módulos de este proyecto"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>{project.modules_count || 0} mód.</span>
                      </button>
                    </td>

                    {/* Mejora Visual / Notas Cortas */}
                    <td className="py-3 px-3">
                      {project.visual_notes ? (
                        <span className="inline-block bg-slate-50 text-slate-700 text-xs px-2 py-0.5 rounded font-medium border border-slate-200/80">
                          {project.visual_notes}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-300">-</span>
                      )}
                    </td>

                    {/* Tareas */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <button
                        onClick={() => onSelectProject(project, 'tasks')}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                          project.pending_tasks > 0 
                            ? 'bg-amber-50 text-amber-700 font-bold border border-amber-200' 
                            : 'bg-slate-50 text-slate-500 border border-slate-200'
                        }`}
                        title="Ver tareas pendientes"
                      >
                        <ListTodo className="w-3.5 h-3.5" />
                        <span>{project.pending_tasks || 0}</span>
                      </button>
                    </td>

                    {/* Bitácora */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <button
                        onClick={() => onSelectProject(project, 'activities')}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                        title="Ver bitácora de qué se hizo"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{project.log_count || 0}</span>
                      </button>
                    </td>

                    {/* Acciones */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        {!isSubBranch && (
                          <button
                            onClick={() => onAddSubBranch(project)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Crear una sub-rama (ej. Básico, Avanzado, etc.)"
                          >
                            <GitBranch className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => onQuickAddActivity(project)}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Anotar avance de hoy en este proyecto"
                        >
                          <Clock className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onQuickAddTask(project)}
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Agregar tarea a este proyecto"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEditProject(project)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Editar datos del proyecto"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteProject(project.id, project.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Eliminar proyecto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARD VIEW (Optimized for Phones & Small Screens) */}
      <div className="block md:hidden divide-y divide-slate-100">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            No hay proyectos que coincidan con los filtros.
          </div>
        ) : (
          filtered.map((project) => {
            const isSubBranch = !!project.parent_id;
            const isExpanded = !!expandedMobile[project.id];

            return (
              <div 
                key={project.id} 
                className={`p-3.5 transition-colors ${isSubBranch ? 'bg-slate-50/60 pl-6 border-l-4 border-l-blue-400' : 'bg-white'}`}
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {isSubBranch && <GitBranch className="w-3.5 h-3.5 text-blue-600" />}
                      <h4 className="font-bold text-slate-900 text-sm">{project.name}</h4>
                      {isSubBranch && getBranchBadge(project.branch_type)}
                    </div>
                    {project.category && (
                      <span className="text-[11px] text-slate-400">{project.category}</span>
                    )}
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusBadgeStyle(project.status)}`}>
                    {project.status}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mt-2.5 flex items-center gap-2">
                  <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full" 
                      style={{ width: `${Math.min(100, Math.max(0, project.progress || 0))}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500">{project.progress || 0}%</span>
                </div>

                {/* Quick pills */}
                <div className="mt-2.5 flex items-center gap-2 flex-wrap text-xs">
                  <button
                    onClick={() => onOpenModules(project)}
                    className="px-2 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold flex items-center gap-1"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>{project.modules_count || 0} Módulos</span>
                  </button>

                  <button
                    onClick={() => onSelectProject(project, 'tasks')}
                    className="px-2 py-1 bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium flex items-center gap-1"
                  >
                    <ListTodo className="w-3.5 h-3.5 text-amber-600" />
                    <span>{project.pending_tasks || 0} tareas</span>
                  </button>

                  <button
                    onClick={() => onSelectProject(project, 'activities')}
                    className="px-2 py-1 bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium flex items-center gap-1"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{project.log_count || 0} logs</span>
                  </button>

                  <button
                    onClick={() => toggleMobileExpand(project.id)}
                    className="ml-auto text-slate-400 p-1 hover:text-slate-700"
                    title="Ver más detalles"
                  >
                    <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {/* Expanded Details on Mobile */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-slate-100 text-xs space-y-2">
                    {project.description && (
                      <p className="text-slate-600 leading-relaxed bg-slate-50 p-2 rounded-lg">
                        {project.description}
                      </p>
                    )}

                    {project.notes && (
                      <p className="text-amber-800 bg-amber-50/70 border border-amber-200/60 p-2 rounded-lg italic">
                        📌 {project.notes}
                      </p>
                    )}

                    {project.visual_notes && (
                      <p className="text-slate-500">
                        Mejora visual: <span className="font-semibold text-slate-700">{project.visual_notes}</span>
                      </p>
                    )}

                    {/* Mobile actions */}
                    <div className="flex items-center gap-2 pt-2">
                      {!isSubBranch && (
                        <button
                          onClick={() => onAddSubBranch(project)}
                          className="px-2.5 py-1.5 bg-blue-50 text-blue-700 rounded-lg font-semibold flex items-center gap-1"
                        >
                          <GitBranch className="w-3.5 h-3.5" />
                          <span>+ Rama</span>
                        </button>
                      )}
                      <button
                        onClick={() => onQuickAddActivity(project)}
                        className="px-2.5 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg font-semibold flex items-center gap-1"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>+ Hice</span>
                      </button>
                      <button
                        onClick={() => onEditProject(project)}
                        className="px-2.5 py-1.5 bg-slate-100 text-slate-700 rounded-lg font-medium"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => onDeleteProject(project.id, project.name)}
                        className="px-2.5 py-1.5 bg-rose-50 text-rose-600 rounded-lg font-medium ml-auto"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
