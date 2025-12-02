// Navigation service for use outside React components
// This allows axios interceptors to trigger navigation

let navigateFunction = null;
let dispatchFunction = null;
let logoutAction = null;
let setNavigationAction = null;

// Pre-load redux actions to avoid async race conditions
import('@/redux/slices').then(({ logout, setNavigation }) => {
  logoutAction = logout;
  setNavigationAction = setNavigation;
});

export const setNavigationFunction = (navigate, dispatch) => {
  navigateFunction = navigate;
  dispatchFunction = dispatch;
};

export const navigateTo = path => {
  if (navigateFunction && dispatchFunction && setNavigationAction) {
    dispatchFunction(setNavigationAction(path));
    navigateFunction(path);
    window.scrollTo(0, 0);
  } else if (navigateFunction && dispatchFunction) {
    // Fallback with dynamic import if actions not yet loaded
    import('@/redux/slices').then(({ setNavigation }) => {
      dispatchFunction(setNavigation(path));
      navigateFunction(path);
      window.scrollTo(0, 0);
    });
  } else {
    // Fallback to window.location if navigate not set
    window.location.href = path;
  }
};

// Clear auth and dispatch logout action to sync Redux state
export const clearAuthAndLogout = () => {
  if (dispatchFunction && logoutAction) {
    dispatchFunction(logoutAction());
  } else if (dispatchFunction) {
    // Fallback with dynamic import if action not yet loaded
    import('@/redux/slices').then(({ logout }) => {
      dispatchFunction(logout());
    });
  }
};

export const navigateToLogin = () => {
  // First clear auth state in Redux to prevent redirect loop
  clearAuthAndLogout();
  navigateTo('/student/login');
};
