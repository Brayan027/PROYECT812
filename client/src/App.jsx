import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import StatsCards from './components/StatsCards';
import ProjectsTable from './components/ProjectsTable';
import TasksView from './components/TasksView';
import ActivityLogView from './components/ActivityLogView';
import CalendarView from './components/CalendarView';
import NotesView from './components/NotesView';

import ProjectModal from './components/ProjectModal';
import TaskModal from './components/TaskModal';
import ActivityModal from './components/ActivityModal';
import NoteModal from './components/NoteModal';
import ModulesModal from './components/ModulesModal';

import { api } from './api';

export default function App() {
  const [activeTab, setActiveTab] = useState('projects');
  
  // Data states
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [notes, setNotes] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Selected project for filtering views
  const [filterProjectId, setFilterProjectId] = useState(null);

  // Modals state
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [defaultParentId, setDefaultParentId] = useState(null);

  // Modules modal state
  const [isModulesModalOpen, setIsModulesModalOpen] = useState(false);
  const [selectedProjectForModules, setSelectedProjectForModules] = useState(null);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskDefaultDate, setTaskDefaultDate] = useState('');
  const [taskDefaultProjectId, setTaskDefaultProjectId] = useState('');

  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [activityDefaultDate, setActivityDefaultDate] = useState('');
  const [activityDefaultProjectId, setActivityDefaultProjectId] = useState('');

  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  // Fetch all initial data
  const refreshAllData = async () => {
    try {
      const [projsData, tasksData, actsData, notesData, statsData] = await Promise.all([
        api.getProjects(),
        api.getTasks(),
        api.getActivities(),
        api.getNotes(),
        api.getStats()
      ]);

      setProjects(projsData);
      setTasks(tasksData);
      setActivities(actsData);
      setNotes(notesData);
      setStats(statsData);
    } catch (err) {
      console.error('Error al cargar datos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  // ==========================================
  // PROJECT HANDLERS
  // ==========================================
  const handleSaveProject = async (projectData) => {
    try {
      if (projectData.id) {
        await api.updateProject(projectData.id, projectData);
      } else {
        await api.createProject(projectData);
      }
      setIsProjectModalOpen(false);
      setEditingProject(null);
      setDefaultParentId(null);
      refreshAllData();
    } catch (err) {
      alert('Error al guardar proyecto: ' + err.message);
    }
  };

  const handleDeleteProject = async (id, name) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar "${name}"? Si tiene sub-ramas o tareas, se eliminarán en cascada.`)) {
      try {
        await api.deleteProject(id);
        refreshAllData();
      } catch (err) {
        alert('Error al eliminar proyecto: ' + err.message);
      }
    }
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setDefaultParentId(project.parent_id || null);
    setIsProjectModalOpen(true);
  };

  const handleAddSubBranch = (parentProject) => {
    setEditingProject(null);
    setDefaultParentId(parentProject.id);
    setIsProjectModalOpen(true);
  };

  const handleOpenModules = (project) => {
    setSelectedProjectForModules(project);
    setIsModulesModalOpen(true);
  };

  // ==========================================
  // TASK HANDLERS
  // ==========================================
  const handleSaveTask = async (taskData) => {
    try {
      if (taskData.id) {
        await api.updateTask(taskData.id, taskData);
      } else {
        await api.createTask(taskData);
      }
      setIsTaskModalOpen(false);
      setEditingTask(null);
      refreshAllData();
    } catch (err) {
      alert('Error al guardar tarea: ' + err.message);
    }
  };

  const handleToggleTaskStatus = async (task) => {
    const newStatus = task.status === 'COMPLETADA' ? 'PENDIENTE' : 'COMPLETADA';
    try {
      await api.updateTask(task.id, { ...task, status: newStatus });
      refreshAllData();
    } catch (err) {
      alert('Error al actualizar estado: ' + err.message);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await api.deleteTask(id);
      refreshAllData();
    } catch (err) {
      alert('Error al eliminar tarea: ' + err.message);
    }
  };

  // ==========================================
  // ACTIVITY LOG HANDLERS
  // ==========================================
  const handleSaveActivity = async (activityData) => {
    try {
      if (activityData.id) {
        await api.updateActivity(activityData.id, activityData);
      } else {
        await api.createActivity(activityData);
      }
      setIsActivityModalOpen(false);
      setEditingActivity(null);
      refreshAllData();
    } catch (err) {
      alert('Error al registrar actividad: ' + err.message);
    }
  };

  const handleDeleteActivity = async (id) => {
    try {
      await api.deleteActivity(id);
      refreshAllData();
    } catch (err) {
      alert('Error al eliminar actividad: ' + err.message);
    }
  };

  // ==========================================
  // NOTE HANDLERS
  // ==========================================
  const handleSaveNote = async (noteData) => {
    try {
      if (noteData.id) {
        await api.updateNote(noteData.id, noteData);
      } else {
        await api.createNote(noteData);
      }
      setIsNoteModalOpen(false);
      setEditingNote(null);
      refreshAllData();
    } catch (err) {
      alert('Error al guardar nota: ' + err.message);
    }
  };

  const handleTogglePinNote = async (note) => {
    try {
      await api.updateNote(note.id, { ...note, pinned: note.pinned ? 0 : 1 });
      refreshAllData();
    } catch (err) {
      alert('Error al actualizar nota: ' + err.message);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await api.deleteNote(id);
      refreshAllData();
    } catch (err) {
      alert('Error al eliminar nota: ' + err.message);
    }
  };

  // Quick triggers from table
  const handleSelectProjectTab = (project, tabTarget) => {
    setFilterProjectId(project.id);
    setActiveTab(tabTarget);
  };

  const handleQuickAddActivity = (project) => {
    setActivityDefaultProjectId(project.id);
    setActivityDefaultDate(new Date().toISOString().split('T')[0]);
    setEditingActivity(null);
    setIsActivityModalOpen(true);
  };

  const handleQuickAddTask = (project) => {
    setTaskDefaultProjectId(project.id);
    setTaskDefaultDate('');
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  // Calendar triggers
  const handleOpenNewActivityWithDate = (dateStr) => {
    setActivityDefaultDate(dateStr);
    setActivityDefaultProjectId('');
    setEditingActivity(null);
    setIsActivityModalOpen(true);
  };

  const handleOpenNewTaskWithDate = (dateStr) => {
    setTaskDefaultDate(dateStr);
    setTaskDefaultProjectId('');
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setFilterProjectId(null);
        }}
        onOpenNewActivity={() => {
          setEditingActivity(null);
          setActivityDefaultDate(new Date().toISOString().split('T')[0]);
          setActivityDefaultProjectId('');
          setIsActivityModalOpen(true);
        }}
        onOpenNewTask={() => {
          setEditingTask(null);
          setTaskDefaultDate('');
          setTaskDefaultProjectId('');
          setIsTaskModalOpen(true);
        }}
        onOpenNewProject={() => {
          setEditingProject(null);
          setDefaultParentId(null);
          setIsProjectModalOpen(true);
        }}
      />

      {/* Main Container (Responsive padding) */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 flex-1 w-full bg-white">
        {/* KPI Summary Cards */}
        <StatsCards stats={stats} />

        {/* Tab Views */}
        {activeTab === 'projects' && (
          <ProjectsTable
            projects={projects}
            onEditProject={handleEditProject}
            onDeleteProject={handleDeleteProject}
            onQuickAddActivity={handleQuickAddActivity}
            onQuickAddTask={handleQuickAddTask}
            onSelectProject={handleSelectProjectTab}
            onOpenModules={handleOpenModules}
            onAddSubBranch={handleAddSubBranch}
          />
        )}

        {activeTab === 'tasks' && (
          <TasksView
            tasks={tasks}
            projects={projects}
            selectedProjectId={filterProjectId}
            onToggleStatus={handleToggleTaskStatus}
            onAddTask={handleSaveTask}
            onEditTask={(task) => {
              setEditingTask(task);
              setIsTaskModalOpen(true);
            }}
            onDeleteTask={handleDeleteTask}
          />
        )}

        {activeTab === 'activities' && (
          <ActivityLogView
            activities={activities}
            projects={projects}
            selectedProjectId={filterProjectId}
            onAddActivity={handleSaveActivity}
            onEditActivity={(act) => {
              setEditingActivity(act);
              setIsActivityModalOpen(true);
            }}
            onDeleteActivity={handleDeleteActivity}
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarView
            projects={projects}
            onOpenNewActivityWithDate={handleOpenNewActivityWithDate}
            onOpenNewTaskWithDate={handleOpenNewTaskWithDate}
          />
        )}

        {activeTab === 'notes' && (
          <NotesView
            notes={notes}
            projects={projects}
            selectedProjectId={filterProjectId}
            onAddNote={handleSaveNote}
            onEditNote={(note) => {
              setEditingNote(note);
              setIsNoteModalOpen(true);
            }}
            onDeleteNote={handleDeleteNote}
            onTogglePin={handleTogglePinNote}
          />
        )}
      </main>

      {/* Modals */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => {
          setIsProjectModalOpen(false);
          setDefaultParentId(null);
        }}
        onSave={handleSaveProject}
        project={editingProject}
        projects={projects}
        defaultParentId={defaultParentId}
      />

      <ModulesModal
        isOpen={isModulesModalOpen}
        onClose={() => {
          setIsModulesModalOpen(false);
          setSelectedProjectForModules(null);
        }}
        project={selectedProjectForModules}
        onModulesUpdated={refreshAllData}
      />

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        task={editingTask}
        projects={projects}
        defaultDate={taskDefaultDate}
        defaultProjectId={taskDefaultProjectId}
      />

      <ActivityModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        onSave={handleSaveActivity}
        activity={editingActivity}
        projects={projects}
        defaultDate={activityDefaultDate}
        defaultProjectId={activityDefaultProjectId}
      />

      <NoteModal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        onSave={handleSaveNote}
        note={editingNote}
        projects={projects}
      />
    </div>
  );
}
