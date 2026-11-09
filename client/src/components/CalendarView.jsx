import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  CheckSquare, 
  Plus, 
  FolderKanban,
  CheckCircle2,
  X
} from 'lucide-react';
import { api } from '../api';

export default function CalendarView({ projects, onOpenNewActivityWithDate, onOpenNewTaskWithDate }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDayStr, setSelectedDayStr] = useState(new Date().toISOString().split('T')[0]);
  const [calendarData, setCalendarData] = useState({ activities: [], tasks: [] });
  const [projectFilter, setProjectFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const loadData = async () => {
    setLoading(true);
    try {
      const startStr = new Date(year, month, -6).toISOString().split('T')[0];
      const endStr = new Date(year, month + 1, 7).toISOString().split('T')[0];

      const data = await api.getCalendarData(startStr, endStr);
      setCalendarData(data);
    } catch (err) {
      console.error('Error cargando datos de calendario:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [year, month]);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDayStr(today.toISOString().split('T')[0]);
  };

  // Build grid days
  const firstDayOfMonth = new Date(year, month, 1);
  const startingDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; // Monday as 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const daysGrid = [];
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const dateObj = new Date(year, month - 1, dayNum);
    const dateStr = dateObj.toISOString().split('T')[0];
    daysGrid.push({ dayNum, dateStr, isCurrentMonth: false });
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const m = String(month + 1).padStart(2, '0');
    const d = String(i).padStart(2, '0');
    const dateStr = `${year}-${m}-${d}`;
    daysGrid.push({ dayNum: i, dateStr, isCurrentMonth: true });
  }

  const remaining = (7 - (daysGrid.length % 7)) % 7;
  for (let i = 1; i <= remaining; i++) {
    const m = String(month + 2).padStart(2, '0');
    const d = String(i).padStart(2, '0');
    const dateStr = `${year}-${m}-${d}`;
    daysGrid.push({ dayNum: i, dateStr, isCurrentMonth: false });
  }

  // Filter items
  const filteredActivities = (calendarData.activities || []).filter(a => 
    projectFilter === 'ALL' || String(a.project_id) === String(projectFilter)
  );

  const filteredTasks = (calendarData.tasks || []).filter(t => 
    projectFilter === 'ALL' || String(t.project_id) === String(projectFilter)
  );

  const activitiesByDate = filteredActivities.reduce((acc, cur) => {
    if (!acc[cur.date]) acc[cur.date] = [];
    acc[cur.date].push(cur);
    return acc;
  }, {});

  const tasksByDate = filteredTasks.reduce((acc, cur) => {
    if (!acc[cur.date]) acc[cur.date] = [];
    acc[cur.date].push(cur);
    return acc;
  }, {});

  const todayStr = new Date().toISOString().split('T')[0];
  const selectedDayActivities = activitiesByDate[selectedDayStr] || [];
  const selectedDayTasks = tasksByDate[selectedDayStr] || [];

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center justify-between sm:justify-start gap-2">
          <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-slate-50 text-slate-600 transition-colors"
              title="Mes anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={goToday}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 border-x border-slate-200 transition-colors"
            >
              Hoy
            </button>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-slate-50 text-slate-600 transition-colors"
              title="Mes siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <h2 className="text-base sm:text-lg font-bold text-slate-900 ml-2">
            {monthNames[month]} {year}
          </h2>
        </div>

        {/* Project filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">Proyecto:</span>
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="w-full sm:w-auto text-xs bg-white border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="ALL">Todos los proyectos</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid + Side details (Responsive on Mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Calendar Grid */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
          {/* Days of week header */}
          <div className="grid grid-cols-7 bg-white border-b border-slate-100 text-center py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <div>Lun</div>
            <div>Mar</div>
            <div>Mié</div>
            <div>Jue</div>
            <div>Vie</div>
            <div>Sáb</div>
            <div>Dom</div>
          </div>

          {/* Grid cells */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 min-h-[380px] sm:min-h-[500px]">
            {daysGrid.map((day, idx) => {
              const isToday = day.dateStr === todayStr;
              const isSelected = day.dateStr === selectedDayStr;
              const dayActivities = activitiesByDate[day.dateStr] || [];
              const dayTasks = tasksByDate[day.dateStr] || [];

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedDayStr(day.dateStr)}
                  className={`p-1 sm:p-2 min-h-[60px] sm:min-h-[90px] cursor-pointer transition-all flex flex-col justify-between ${
                    !day.isCurrentMonth ? 'bg-slate-50/40 text-slate-300' : 'bg-white text-slate-800'
                  } ${isSelected ? 'ring-2 ring-blue-600 bg-blue-50/20 z-10' : 'hover:bg-slate-50/60'}`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] sm:text-xs font-bold w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full ${
                      isToday 
                        ? 'bg-blue-600 text-white' 
                        : isSelected 
                          ? 'bg-blue-100 text-blue-700' 
                          : ''
                    }`}>
                      {day.dayNum}
                    </span>

                    {(dayActivities.length > 0 || dayTasks.length > 0) && (
                      <div className="flex gap-1">
                        {dayActivities.length > 0 && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        )}
                        {dayTasks.length > 0 && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Badges preview (Desktop & Tablet) */}
                  <div className="hidden sm:block mt-1 space-y-1 overflow-hidden">
                    {dayActivities.slice(0, 2).map((act, i) => (
                      <div 
                        key={`act-${i}`} 
                        className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200/50 rounded px-1 py-0.5 truncate flex items-center gap-1 font-medium"
                      >
                        <Clock className="w-2.5 h-2.5 shrink-0 text-emerald-600" />
                        <span className="truncate">{act.title}</span>
                      </div>
                    ))}

                    {dayTasks.slice(0, 2).map((tsk, i) => (
                      <div 
                        key={`tsk-${i}`} 
                        className={`text-[10px] rounded px-1 py-0.5 truncate flex items-center gap-1 font-medium ${
                          tsk.status === 'COMPLETADA'
                            ? 'bg-slate-100 text-slate-400 line-through'
                            : 'bg-amber-50 text-amber-800 border border-amber-200/50'
                        }`}
                      >
                        <CheckSquare className="w-2.5 h-2.5 shrink-0 text-amber-600" />
                        <span className="truncate">{tsk.title}</span>
                      </div>
                    ))}
                  </div>

                  {/* Mobile indicator for entries count */}
                  <div className="block sm:hidden text-[9px] text-slate-400 mt-1">
                    {(dayActivities.length + dayTasks.length) > 0 && (
                      <span>{dayActivities.length + dayTasks.length} act.</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Details Panel */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Día Seleccionado</span>
                <h3 className="text-sm font-bold text-slate-900 capitalize">
                  {selectedDayStr}
                </h3>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => onOpenNewActivityWithDate(selectedDayStr)}
                  className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs flex items-center gap-1 font-semibold"
                >
                  <Clock className="w-3 h-3" />
                  <span>+ Hice</span>
                </button>
                <button
                  onClick={() => onOpenNewTaskWithDate(selectedDayStr)}
                  className="px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs flex items-center gap-1 font-semibold"
                >
                  <Plus className="w-3 h-3" />
                  <span>+ Tarea</span>
                </button>
              </div>
            </div>

            {/* Activities in this day */}
            <div className="mb-4">
              <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Qué se hizo ({selectedDayActivities.length})</span>
              </h4>

              {selectedDayActivities.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Sin actividades registradas hoy.</p>
              ) : (
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {selectedDayActivities.map(act => (
                    <div key={act.id} className="p-2 bg-emerald-50/40 border border-emerald-100 rounded-xl text-xs">
                      <div className="flex items-center justify-between font-semibold text-emerald-950">
                        <span>{act.title}</span>
                        {act.hours_spent > 0 && (
                          <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1 rounded">
                            {act.hours_spent}h
                          </span>
                        )}
                      </div>
                      {act.project_name && (
                        <span className="text-[10px] text-slate-400 block mt-0.5">📁 {act.project_name}</span>
                      )}
                      {act.details && (
                        <p className="text-[11px] text-slate-600 mt-1 italic">{act.details}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tasks due on this day */}
            <div>
              <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-amber-600" />
                <span>Tareas ({selectedDayTasks.length})</span>
              </h4>

              {selectedDayTasks.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Sin tareas para esta fecha.</p>
              ) : (
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {selectedDayTasks.map(tsk => (
                    <div key={tsk.id} className={`p-2 border rounded-xl text-xs ${
                      tsk.status === 'COMPLETADA' ? 'bg-slate-50 border-slate-100 text-slate-400 line-through' : 'bg-amber-50/30 border-amber-200/80 text-slate-800'
                    }`}>
                      <div className="font-semibold flex items-center justify-between">
                        <span>{tsk.title}</span>
                        <span className="text-[10px] font-bold uppercase">{tsk.status}</span>
                      </div>
                      {tsk.project_name && (
                        <span className="text-[10px] text-slate-400 block mt-0.5">📁 {tsk.project_name}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
            <span>🟢 Verde: Avances</span>
            <span>🟡 Amarillo: Tareas</span>
          </div>
        </div>
      </div>
    </div>
  );
}
