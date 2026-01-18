
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Task, RepoHistoryItem, ArticleHistoryItem, DevStudioState } from '../types';
import { PersistenceService } from '../services/persistence';

interface ProjectContextType {
  // Project State (for DevStudio)
  currentProject: DevStudioState | null;
  setCurrentProject: (project: DevStudioState | null) => void;

  // Task Management
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  addTask: (task: Task) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  cyclePriority: (id: string) => void;

  // History
  repoHistory: RepoHistoryItem[];
  addRepoHistory: (item: RepoHistoryItem) => void;
  articleHistory: ArticleHistoryItem[];
  addArticleHistory: (item: ArticleHistoryItem) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentProject, setCurrentProject] = useState<DevStudioState | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [repoHistory, setRepoHistory] = useState<RepoHistoryItem[]>([]);
  const [articleHistory, setArticleHistory] = useState<ArticleHistoryItem[]>([]);

  // Load Initial Data from Persistence
  useEffect(() => {
    const loadData = async () => {
      try {
        const [loadedTasks, loadedRepoHistory, loadedArticleHistory, loadedProject] = await Promise.all([
          PersistenceService.getAllTasks(),
          PersistenceService.getAllRepoHistory(),
          PersistenceService.getAllArticleHistory(),
          PersistenceService.getCurrentProject()
        ]);

        setTasks(loadedTasks);
        setRepoHistory(loadedRepoHistory);
        setArticleHistory(loadedArticleHistory);
        setCurrentProject(loadedProject);
      } catch (e) {
        console.error("Failed to load persistence data", e);
      }
    };
    loadData();
  }, []);

  const handleSetCurrentProject = (project: DevStudioState | null) => {
    setCurrentProject(project);
    if (project) {
        PersistenceService.saveCurrentProject(project).catch(console.error);
    }
  };

  const addTask = (task: Task) => {
    setTasks(prev => [task, ...prev]);
    PersistenceService.saveTask(task).catch(console.error);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => {
        const newTasks = prev.map(t => {
            if (t.id === id) {
                const updated = { ...t, completed: !t.completed };
                PersistenceService.updateTask(updated).catch(console.error);
                return updated;
            }
            return t;
        });
        return newTasks;
    });
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    PersistenceService.deleteTask(id).catch(console.error);
  };

  const cyclePriority = (id: string) => {
    setTasks(prev => {
        const newTasks = prev.map(t => {
            if (t.id === id) {
                const priorities: ('high' | 'medium' | 'low')[] = ['high', 'medium', 'low'];
                const currentIndex = priorities.indexOf(t.priority);
                const nextIndex = (currentIndex + 1) % priorities.length;
                const updated = { ...t, priority: priorities[nextIndex] };
                PersistenceService.updateTask(updated).catch(console.error);
                return updated;
            }
            return t;
        });
        return newTasks;
    });
  };

  const addRepoHistory = (item: RepoHistoryItem) => {
    setRepoHistory(prev => [item, ...prev]);
    PersistenceService.addRepoHistory(item).catch(console.error);
  };

  const addArticleHistory = (item: ArticleHistoryItem) => {
    setArticleHistory(prev => [item, ...prev]);
    PersistenceService.addArticleHistory(item).catch(console.error);
  };

  return (
    <ProjectContext.Provider value={{
      currentProject,
      setCurrentProject: handleSetCurrentProject,
      tasks,
      setTasks,
      addTask,
      toggleTask,
      deleteTask,
      cyclePriority,
      repoHistory,
      addRepoHistory,
      articleHistory,
      addArticleHistory
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjectContext must be used within a ProjectProvider');
  }
  return context;
};
