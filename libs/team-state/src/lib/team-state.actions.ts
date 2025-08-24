import { createAction, props } from '@ngrx/store';
import { TeamStateEntity } from './team-state.models';

export const initTeamState = createAction('[TeamState Page] Init');

export const loadTeamStateSuccess = createAction(
  '[TeamState/API] Load TeamState Success',
  props<{ teamState: TeamStateEntity[] }>()
);

export const loadTeamStateFailure = createAction(
  '[TeamState/API] Load TeamState Failure',
  props<{ error: any }>()
);

// Add/remove members in the single team
export const addToTeam = createAction(
  '[TeamState] Add To Team',
  props<{ member: TeamStateEntity }>()
);

export const removeFromTeam = createAction(
  '[TeamState] Remove From Team',
  props<{ id: string | number }>()
);
