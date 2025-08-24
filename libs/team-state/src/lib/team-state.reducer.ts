import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';

import * as TeamStateActions from './team-state.actions';
import { TeamStateEntity } from './team-state.models';

export const TEAM_STATE_FEATURE_KEY = 'teamState';

export interface TeamStateState extends EntityState<TeamStateEntity> {
  selectedId?: string | number; // which TeamState record has been selected
  loaded: boolean; // has the TeamState list been loaded
  error?: string | null; // last known error (if any)
}

export interface TeamStatePartialState {
  readonly [TEAM_STATE_FEATURE_KEY]: TeamStateState;
}

export const teamStateAdapter: EntityAdapter<TeamStateEntity> =
  createEntityAdapter<TeamStateEntity>();

export const initialTeamStateState: TeamStateState =
  teamStateAdapter.getInitialState({
    // set initial required properties
    loaded: false,
  });

const reducer = createReducer(
  initialTeamStateState,
  on(TeamStateActions.initTeamState, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(TeamStateActions.loadTeamStateSuccess, (state, { teamState }) =>
    teamStateAdapter.setAll(teamState, { ...state, loaded: true })
  ),
  on(TeamStateActions.loadTeamStateFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  // Add to team with constraints: max 5 members and no duplicates
  on(TeamStateActions.addToTeam, (state, { member }) => {
    if (state.ids.length >= 5) {
      return state;
    }
    if (state.entities[member.id]) {
      return state;
    }
    return teamStateAdapter.addOne(member, state);
  }),
  on(TeamStateActions.removeFromTeam, (state, { id }) =>
    typeof id === 'number'
      ? teamStateAdapter.removeOne(id, state)
      : teamStateAdapter.removeOne(id, state)
  )
);

export function teamStateReducer(
  state: TeamStateState | undefined,
  action: Action
) {
  return reducer(state, action);
}
