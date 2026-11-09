import React from 'react';
import { Layers, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

export default function StatsCards({ stats }) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 mb-5 sm:mb-6">
      <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Proyectos</p>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900">{stats.totalProjects || 0}</span>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md">
              {stats.completedProjects || 0} listos
            </span>
          </div>
        </div>
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center border border-slate-100">
          <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
        </div>
      </div>

      <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Por hacer</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl sm:text-2xl font-extrabold text-amber-600">{stats.pendingTasks || 0}</span>
            <span className="text-[10px] sm:text-xs text-slate-400 hidden sm:inline">pendientes</span>
          </div>
        </div>
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center border border-slate-100">
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
        </div>
      </div>

      <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Qué hice hoy</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl sm:text-2xl font-extrabold text-emerald-600">{stats.todayLogs || 0}</span>
            <span className="text-[10px] sm:text-xs text-slate-400 hidden sm:inline">registros</span>
          </div>
        </div>
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center border border-slate-100">
          <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
        </div>
      </div>

      <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Horas Totales</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900">{stats.totalHours || 0}h</span>
            <span className="text-[10px] sm:text-xs text-slate-400 hidden sm:inline">dedicadas</span>
          </div>
        </div>
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center border border-slate-100">
          <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
        </div>
      </div>
    </div>
  );
}
