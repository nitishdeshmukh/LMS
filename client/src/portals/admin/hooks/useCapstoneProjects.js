import { useState } from 'react';

export const useCapstoneProjects = () => {
  const [capstoneProjects, setCapstoneProjects] = useState([
    {
      id: 1,
      title: '',
      description: '',
      requirements: [''],
      deliverables: [''],
      isLocked: false,
    },
  ]);

  const addCapstoneProject = () => {
    setCapstoneProjects([
      ...capstoneProjects,
      {
        id: capstoneProjects.length + 1,
        title: '',
        description: '',
        requirements: [''],
        deliverables: [''],
        isLocked: false,
      },
    ]);
  };

  const deleteCapstoneProject = projectId => {
    setCapstoneProjects(capstoneProjects.filter(p => p.id !== projectId));
  };

  const updateCapstoneProject = (projectId, field, value) => {
    setCapstoneProjects(
      capstoneProjects.map(p => (p.id === projectId ? { ...p, [field]: value } : p)),
    );
  };

  const addRequirement = projectId => {
    setCapstoneProjects(
      capstoneProjects.map(p =>
        p.id === projectId ? { ...p, requirements: [...p.requirements, ''] } : p,
      ),
    );
  };

  const updateRequirement = (projectId, reqIndex, value) => {
    setCapstoneProjects(
      capstoneProjects.map(p =>
        p.id === projectId
          ? {
              ...p,
              requirements: p.requirements.map((req, idx) => (idx === reqIndex ? value : req)),
            }
          : p,
      ),
    );
  };

  const removeRequirement = (projectId, reqIndex) => {
    setCapstoneProjects(
      capstoneProjects.map(p =>
        p.id === projectId
          ? { ...p, requirements: p.requirements.filter((_, idx) => idx !== reqIndex) }
          : p,
      ),
    );
  };

  const addDeliverable = projectId => {
    setCapstoneProjects(
      capstoneProjects.map(p =>
        p.id === projectId ? { ...p, deliverables: [...p.deliverables, ''] } : p,
      ),
    );
  };

  const updateDeliverable = (projectId, delIndex, value) => {
    setCapstoneProjects(
      capstoneProjects.map(p =>
        p.id === projectId
          ? {
              ...p,
              deliverables: p.deliverables.map((del, idx) => (idx === delIndex ? value : del)),
            }
          : p,
      ),
    );
  };

  const removeDeliverable = (projectId, delIndex) => {
    setCapstoneProjects(
      capstoneProjects.map(p =>
        p.id === projectId
          ? { ...p, deliverables: p.deliverables.filter((_, idx) => idx !== delIndex) }
          : p,
      ),
    );
  };

  return {
    capstoneProjects,
    setCapstoneProjects,
    addCapstoneProject,
    deleteCapstoneProject,
    updateCapstoneProject,
    addRequirement,
    updateRequirement,
    removeRequirement,
    addDeliverable,
    updateDeliverable,
    removeDeliverable,
  };
};

