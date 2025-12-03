import { useState } from 'react';

export const useModules = () => {
  const [modules, setModules] = useState([
    {
      id: 1,
      title: '',
      maxTimelineInDays: '',
      description: '',
      textLinks: [''],
      videoLinks: [''],
      tasks: [{ id: 1, title: '', description: '' }],
      quizzes: [
        {
          id: 1,
          title: '',
          questions: [{ questionText: '', options: ['', ''], correctAnswer: 0 }],
        },
      ],
      order: 0,
    },
  ]);

  const addModule = () => {
    setModules([
      ...modules,
      {
        id: modules.length + 1,
        title: '',
        maxTimelineInDays: '',
        description: '',
        textLinks: [''],
        videoLinks: [''],
        tasks: [{ id: 1, title: '', description: '' }],
        quizzes: [
          {
            id: 1,
            title: '',
            questions: [{ questionText: '', options: ['', ''], correctAnswer: 0 }],
          },
        ],
        order: modules.length,
      },
    ]);
  };

  const deleteModule = moduleId => {
    setModules(modules.filter(m => m.id !== moduleId));
  };

  const updateModule = (moduleId, field, value) => {
    setModules(modules.map(m => (m.id === moduleId ? { ...m, [field]: value } : m)));
  };

  const addTextLink = moduleId => {
    setModules(
      modules.map(m => (m.id === moduleId ? { ...m, textLinks: [...m.textLinks, ''] } : m)),
    );
  };

  const updateTextLink = (moduleId, linkIndex, value) => {
    setModules(
      modules.map(m =>
        m.id === moduleId
          ? { ...m, textLinks: m.textLinks.map((link, idx) => (idx === linkIndex ? value : link)) }
          : m,
      ),
    );
  };

  const removeTextLink = (moduleId, linkIndex) => {
    setModules(
      modules.map(m =>
        m.id === moduleId
          ? { ...m, textLinks: m.textLinks.filter((_, idx) => idx !== linkIndex) }
          : m,
      ),
    );
  };

  const addVideoLink = moduleId => {
    setModules(
      modules.map(m => (m.id === moduleId ? { ...m, videoLinks: [...m.videoLinks, ''] } : m)),
    );
  };

  const updateVideoLink = (moduleId, linkIndex, value) => {
    setModules(
      modules.map(m =>
        m.id === moduleId
          ? {
              ...m,
              videoLinks: m.videoLinks.map((link, idx) => (idx === linkIndex ? value : link)),
            }
          : m,
      ),
    );
  };

  const removeVideoLink = (moduleId, linkIndex) => {
    setModules(
      modules.map(m =>
        m.id === moduleId
          ? { ...m, videoLinks: m.videoLinks.filter((_, idx) => idx !== linkIndex) }
          : m,
      ),
    );
  };

  const addQuiz = moduleId => {
    setModules(
      modules.map(m =>
        m.id === moduleId
          ? {
              ...m,
              quizzes: [
                ...m.quizzes,
                {
                  id: m.quizzes.length + 1,
                  title: '',
                  questions: [{ questionText: '', options: ['', ''], correctAnswer: 0 }],
                },
              ],
            }
          : m,
      ),
    );
  };

  const deleteQuiz = (moduleId, quizId) => {
    setModules(
      modules.map(m =>
        m.id === moduleId ? { ...m, quizzes: m.quizzes.filter(q => q.id !== quizId) } : m,
      ),
    );
  };

  const updateQuiz = (moduleId, quizId, field, value) => {
    setModules(
      modules.map(m =>
        m.id === moduleId
          ? { ...m, quizzes: m.quizzes.map(q => (q.id === quizId ? { ...q, [field]: value } : q)) }
          : m,
      ),
    );
  };

  const addQuestion = (moduleId, quizId) => {
    setModules(
      modules.map(m =>
        m.id === moduleId
          ? {
              ...m,
              quizzes: m.quizzes.map(q =>
                q.id === quizId
                  ? {
                      ...q,
                      questions: [
                        ...q.questions,
                        { questionText: '', options: ['', ''], correctAnswer: 0 },
                      ],
                    }
                  : q,
              ),
            }
          : m,
      ),
    );
  };

  const deleteQuestion = (moduleId, quizId, questionIndex) => {
    setModules(
      modules.map(m =>
        m.id === moduleId
          ? {
              ...m,
              quizzes: m.quizzes.map(q =>
                q.id === quizId
                  ? { ...q, questions: q.questions.filter((_, idx) => idx !== questionIndex) }
                  : q,
              ),
            }
          : m,
      ),
    );
  };

  const updateQuestion = (moduleId, quizId, questionIndex, field, value) => {
    setModules(
      modules.map(m =>
        m.id === moduleId
          ? {
              ...m,
              quizzes: m.quizzes.map(q =>
                q.id === quizId
                  ? {
                      ...q,
                      questions: q.questions.map((question, idx) =>
                        idx === questionIndex ? { ...question, [field]: value } : question,
                      ),
                    }
                  : q,
              ),
            }
          : m,
      ),
    );
  };

  const addOption = (moduleId, quizId, questionIndex) => {
    setModules(
      modules.map(m =>
        m.id === moduleId
          ? {
              ...m,
              quizzes: m.quizzes.map(q =>
                q.id === quizId
                  ? {
                      ...q,
                      questions: q.questions.map((question, idx) =>
                        idx === questionIndex
                          ? { ...question, options: [...question.options, ''] }
                          : question,
                      ),
                    }
                  : q,
              ),
            }
          : m,
      ),
    );
  };

  const updateOption = (moduleId, quizId, questionIndex, optionIndex, value) => {
    setModules(
      modules.map(m =>
        m.id === moduleId
          ? {
              ...m,
              quizzes: m.quizzes.map(q =>
                q.id === quizId
                  ? {
                      ...q,
                      questions: q.questions.map((question, idx) =>
                        idx === questionIndex
                          ? {
                              ...question,
                              options: question.options.map((opt, optIdx) =>
                                optIdx === optionIndex ? value : opt,
                              ),
                            }
                          : question,
                      ),
                    }
                  : q,
              ),
            }
          : m,
      ),
    );
  };

  return {
    modules,
    setModules,
    addModule,
    deleteModule,
    updateModule,
    addTextLink,
    updateTextLink,
    removeTextLink,
    addVideoLink,
    updateVideoLink,
    removeVideoLink,
    addQuiz,
    deleteQuiz,
    updateQuiz,
    addQuestion,
    deleteQuestion,
    updateQuestion,
    addOption,
    updateOption,
  };
};

