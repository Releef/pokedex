import { ActionReducer, INIT, UPDATE } from '@ngrx/store';
import { TEAM_STATE_FEATURE_KEY, TeamStateState } from './team-state.reducer';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

/**
 * Meta-reducer that persists only the teamState slice to localStorage and
 * rehydrates it on application INIT/UPDATE.
 */
export function localStorageSyncMetaReducer<State>(
  reducer: ActionReducer<State>
): ActionReducer<State> {
  return (state: State | undefined, action: any): State => {
    // Run the original reducer first to get the next state
    const nextState = reducer(state, action);

    if (!isBrowser()) {
      return nextState;
    }

    try {
      // Rehydrate on app init / HMR update
      if (action.type === INIT || action.type === UPDATE) {
        const saved = localStorage.getItem(TEAM_STATE_FEATURE_KEY);
        if (saved) {
          const parsed: TeamStateState = JSON.parse(saved);
          // Merge the saved team state into the next state
          return {
            ...(nextState as any),
            [TEAM_STATE_FEATURE_KEY]: parsed,
          } as State;
        }
        return nextState;
      }

      // Persist only the teamState slice after each non-init action
      const teamSlice = (nextState as any)?.[TEAM_STATE_FEATURE_KEY];
      if (teamSlice !== undefined) {
        localStorage.setItem(TEAM_STATE_FEATURE_KEY, JSON.stringify(teamSlice));
      }
    } catch (e) {
      // Silently ignore any storage/serialization errors to avoid breaking the app
      // console.warn('localStorageSyncMetaReducer error', e);
    }

    return nextState;
  };
}
