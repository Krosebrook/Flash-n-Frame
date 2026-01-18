
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useMemo } from 'react';
import { Task } from '../types';
import { useProjectContext } from '../contexts/ProjectContext';

export const useTaskManagement = () => {
  const { tasks, addTask: addTaskToContext, toggleTask, deleteTask, cyclePriority } = useProjectContext();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [newTaskDate, setNewTaskDate] = useState('');

  // Filtering State
  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');
  const [filterDate, setFilterDate] = useState<'all' | 'today' | 'overdue' | 'future'>('all');

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      priority: newTaskPriority,
      dueDate: newTaskDate || new Date().toISOString().split('T')[0],
      completed: false,
      createdAt: Date.now(),
    };

    addTaskToContext(newTask);
    setNewTaskTitle('');
    setNewTaskDate('');
  };

  // Advanced Filtering Logic
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // 1. Filter by Priority
      if (filterPriority !== 'all' && task.priority !== filterPriority) return false;

      // 2. Filter by Status
      if (filterStatus === 'active' && task.completed) return false;
      if (filterStatus === 'completed' && !task.completed) return false;

      // 3. Filter by Date
      if (filterDate !== 'all') {
        const today = new Date().toISOString().split('T')[0];
        if (filterDate === 'today' && task.dueDate !== today) return false;
        if (filterDate === 'overdue' && (task.dueDate < today && !task.completed)) return false; 
        if (filterDate === 'overdue' && (task.dueDate >= today || task.completed)) return false; 
        if (filterDate === 'future' && task.dueDate <= today) return false;
      }

      return true;
    });
  }, [tasks, filterPriority, filterStatus, filterDate]);

  return {
    tasks,
    filteredTasks,
    newTaskState: {
      title: newTaskTitle,
      setTitle: setNewTaskTitle,
      priority: newTaskPriority,
      setPriority: setNewTaskPriority,
      date: newTaskDate,
      setDate: setNewTaskDate
    },
    filterState: {
      priority: filterPriority,
      setPriority: setFilterPriority,
      status: filterStatus,
      setStatus: setFilterStatus,
      date: filterDate,
      setDate: setFilterDate
    },
    actions: {
      addTask,
      toggleTask,
      deleteTask,
      cyclePriority
    }
  };
};
