import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  TEAM_STATE_FEATURE_KEY,
  TeamStateState,
  teamStateAdapter,
} from './team-state.reducer';

// Lookup the 'TeamState' feature state managed by NgRx
export const selectTeamStateState = createFeatureSelector<TeamStateState>(
  TEAM_STATE_FEATURE_KEY
);

const { selectAll, selectEntities } = teamStateAdapter.getSelectors();

export const selectTeamStateLoaded = createSelector(
  selectTeamStateState,
  (state: TeamStateState) => state.loaded
);

export const selectTeamStateError = createSelector(
  selectTeamStateState,
  (state: TeamStateState) => state.error
);

export const selectAllTeamState = createSelector(
  selectTeamStateState,
  (state: TeamStateState) => selectAll(state)
);

export const selectTeamStateEntities = createSelector(
  selectTeamStateState,
  (state: TeamStateState) => selectEntities(state)
);

export const selectSelectedId = createSelector(
  selectTeamStateState,
  (state: TeamStateState) => state.selectedId
);

export const selectEntity = createSelector(
  selectTeamStateEntities,
  selectSelectedId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : undefined)
);
