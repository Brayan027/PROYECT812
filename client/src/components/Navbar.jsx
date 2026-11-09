import React from 'react';
import { 
  FolderKanban, 
  CheckSquare, 
  BookOpen, 
  Calendar as CalendarIcon, 
  StickyNote, 
  Plus, 
  Clock,
  Sparkles
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenNewActivity, onOpenNewTask, onOpenNewProject }) {
  const tabs = [
    { id: 'projects', label: 'Proyectos & Tablero', icon: FolderKanban },
    { id: 'tasks', label: '¿Qué debo hacer?', icon: CheckSquare },
    { id: 'activities', label: 'Bitácora ("Qué hice")', icon: BookOpen },
    { id: 'calendar', label: 'Calendario', icon: CalendarIcon },
    { id: 'notes', label: 'Notas', icon: StickyNote },
  ];

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Brand */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-slate-950 text-white flex items-center justify-center shadow-xs shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="truncate">
              <h1 className="text-sm sm:text-base font-bold text-slate-900 leading-tight truncate">
                Control de Proyectos
              </h1>
              <p className="text-[11px] text-slate-400 hidden sm:block">Bitácora, Tareas & Módulos</p>
            </div>
          </div>

          {/* Quick Actions (Mobile friendly) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={onOpenNewActivity}
              className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 active:bg-black rounded-xl shadow-xs transition-all"
              title="Registrar qué hice hoy"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>+ Qué hice</span>
            </button>

            <button
              onClick={onOpenNewTask}
              className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all"
              title="Crear nueva tarea"
            >
              <CheckSquare className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Nueva Tarea</span>
            </button>

            <button
              onClick={onOpenNewProject}
              className="p-2 sm:px-3 sm:py-2 text-xs sm:text-sm font-semibold text-blue-700 bg-blue-50/80 hover:bg-blue-100 border border-blue-200/80 rounded-xl transition-all flex items-center gap-1.5"
              title="Nuevo Proyecto o Sub-rama"
            >
              <Plus className="w-4 h-4 text-blue-600" />
              <span className="hidden md:inline">Nuevo Proyecto</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs (Scrollable on small screens) */}
        <nav className="flex space-x-1 border-t border-slate-100 overflow-x-auto py-1 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl whitespace-nowrap transition-all ${
                  isActive
                    ? 'text-slate-900 bg-slate-100/80 font-bold'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-900' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
