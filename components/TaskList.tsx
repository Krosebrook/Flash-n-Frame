
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { 
  CheckCircle, Circle, Calendar, Flag, Filter, Plus, Trash2, 
  ChevronDown, ListFilter 
} from 'lucide-react';
import { useTaskManagement } from '../hooks/useTaskManagement';

export const TaskList: React.FC = () => {
  const { 
    filteredTasks, 
    newTaskState, 
    filterState, 
    actions 
  } = useTaskManagement();

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'high': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'low': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/30">
      
      {/* Filtering Toolbar */}
      <div className="p-3 border-b border-white/5 bg-slate-900/50 space-y-3">
        <div className="flex items-center justify-between">
           <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
             <ListFilter className="w-3.5 h-3.5" /> Filter Tasks
           </h4>
           <button 
             onClick={() => setIsFilterOpen(!isFilterOpen)}
             className={`p-1.5 rounded-lg transition-colors ${isFilterOpen ? 'bg-indigo-500/20 text-indigo-300' : 'hover:bg-white/5 text-slate-500'}`}
           >
             <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
           </button>
        </div>

        {isFilterOpen && (
          <div className="grid grid-cols-3 gap-2 animate-in fade-in slide-in-from-top-1">
            {/* Priority Filter */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-600 font-mono uppercase">Priority</label>
              <select 
                value={filterState.priority}
                onChange={(e) => filterState.setPriority(e.target.value as any)}
                className="w-full bg-slate-950 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-slate-300 focus:ring-1 focus:ring-indigo-500/50"
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-600 font-mono uppercase">Status</label>
              <select 
                value={filterState.status}
                onChange={(e) => filterState.setStatus(e.target.value as any)}
                className="w-full bg-slate-950 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-slate-300 focus:ring-1 focus:ring-indigo-500/50"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="completed">Completed Only</option>
              </select>
            </div>

             {/* Date Filter */}
             <div className="space-y-1">
              <label className="text-[10px] text-slate-600 font-mono uppercase">Due Date</label>
              <select 
                value={filterState.date}
                onChange={(e) => filterState.setDate(e.target.value as any)}
                className="w-full bg-slate-950 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-slate-300 focus:ring-1 focus:ring-indigo-500/50"
              >
                <option value="all">Any Date</option>
                <option value="today">Due Today</option>
                <option value="overdue">Overdue</option>
                <option value="future">Future</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-600 space-y-2 opacity-60">
             <Filter className="w-8 h-8" />
             <p className="text-xs font-mono">No tasks match filter.</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div 
              key={task.id} 
              className={`group flex items-start gap-3 p-3 rounded-xl border transition-all ${
                task.completed 
                ? 'bg-slate-900/30 border-white/5 opacity-60' 
                : 'bg-slate-900/80 border-white/10 hover:border-indigo-500/30'
              }`}
            >
              <button 
                onClick={() => actions.toggleTask(task.id)}
                className={`mt-0.5 transition-colors ${task.completed ? 'text-emerald-500' : 'text-slate-600 hover:text-slate-400'}`}
              >
                {task.completed ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
              </button>
              
              <div className="flex-1 min-w-0">
                 <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-medium leading-tight ${task.completed ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                      {task.title}
                    </p>
                    <button 
                      onClick={() => actions.deleteTask(task.id)}
                      className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                 </div>
                 
                 <div className="flex flex-wrap items-center gap-2 mt-2">
                    <button 
                       onClick={() => actions.cyclePriority(task.id)}
                       className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase border flex items-center gap-1 cursor-pointer hover:brightness-110 transition-all ${getPriorityColor(task.priority)}`}
                       title="Click to change priority"
                    >
                       <Flag className="w-3 h-3" /> {task.priority}
                    </button>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono border flex items-center gap-1 ${
                       !task.completed && task.dueDate < new Date().toISOString().split('T')[0]
                       ? 'text-red-300 bg-red-500/10 border-red-500/20' 
                       : 'text-slate-400 bg-slate-800 border-white/5'
                    }`}>
                       <Calendar className="w-3 h-3" /> {task.dueDate}
                    </span>
                 </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Task Form */}
      <div className="p-3 bg-slate-950/80 border-t border-white/5 shrink-0">
        <form onSubmit={actions.addTask} className="space-y-2">
          <input
            type="text"
            value={newTaskState.title}
            onChange={(e) => newTaskState.setTitle(e.target.value)}
            placeholder="New task..."
            className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:ring-1 focus:ring-indigo-500/50"
          />
          <div className="flex gap-2">
             <select
               value={newTaskState.priority}
               onChange={(e) => newTaskState.setPriority(e.target.value as any)}
               className="bg-slate-900/50 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-slate-400 focus:ring-1 focus:ring-indigo-500/50"
             >
               <option value="high">High Priority</option>
               <option value="medium">Medium Priority</option>
               <option value="low">Low Priority</option>
             </select>
             <input 
               type="date"
               value={newTaskState.date}
               onChange={(e) => newTaskState.setDate(e.target.value)}
               className="bg-slate-900/50 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-slate-400 focus:ring-1 focus:ring-indigo-500/50"
             />
             <button 
               type="submit" 
               disabled={!newTaskState.title.trim()}
               className="ml-auto p-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded-lg transition-colors disabled:opacity-50"
             >
                <Plus className="w-4 h-4" />
             </button>
          </div>
        </form>
      </div>

    </div>
  );
};
