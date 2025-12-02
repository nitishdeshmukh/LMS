import { configureStore } from '@reduxjs/toolkit';

import { authReducer, uiReducer, studentReducer, enrollmentReducer } from './slices';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    student: studentReducer,
    enrollment: enrollmentReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serializable check
        ignoredActions: ['student/fetchDashboard/fulfilled'],
      },
    }),
  devTools: import.meta.env.DEV,
});

