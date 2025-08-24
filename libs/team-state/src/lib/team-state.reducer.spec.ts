import { Action } from '@ngrx/store';

import * as TeamStateActions from './team-state.actions';
import { TeamStateEntity } from './team-state.models';
import {
  TeamStateState,
  initialTeamStateState,
  teamStateReducer,
} from './team-state.reducer';

describe('TeamState Reducer', () => {
  const createTeamStateEntity = (id: string | number, name = ''): TeamStateEntity => ({
    id,
    name: name || `name-${id}`,
  });

  describe('valid TeamState actions', () => {
    it('loadTeamStateSuccess should return the list of known TeamState', () => {
      const teamState = [
        createTeamStateEntity('PRODUCT-AAA'),
        createTeamStateEntity('PRODUCT-zzz'),
      ];
      const action = TeamStateActions.loadTeamStateSuccess({ teamState });

      const result: TeamStateState = teamStateReducer(
        initialTeamStateState,
        action
      );

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(2);
    });

    it('addToTeam should add a member, skip duplicates, and enforce max 5', () => {
      // Add first member
      let state = teamStateReducer(
        initialTeamStateState,
        TeamStateActions.addToTeam({ member: createTeamStateEntity(1) })
      );
      expect(state.ids).toEqual([1]);

      // Add duplicate
      state = teamStateReducer(
        state,
        TeamStateActions.addToTeam({ member: createTeamStateEntity(1) })
      );
      expect(state.ids).toEqual([1]);

      // Fill up to 5
      state = teamStateReducer(state, TeamStateActions.addToTeam({ member: createTeamStateEntity(2) }));
      state = teamStateReducer(state, TeamStateActions.addToTeam({ member: createTeamStateEntity(3) }));
      state = teamStateReducer(state, TeamStateActions.addToTeam({ member: createTeamStateEntity(4) }));
      state = teamStateReducer(state, TeamStateActions.addToTeam({ member: createTeamStateEntity(5) }));
      expect(state.ids.length).toBe(5);

      // Try adding 6th
      state = teamStateReducer(state, TeamStateActions.addToTeam({ member: createTeamStateEntity(6) }));
      expect(state.ids.length).toBe(5);
    });

    it('removeFromTeam should remove by id', () => {
      const preloaded = teamStateReducer(
        initialTeamStateState,
        TeamStateActions.loadTeamStateSuccess({
          teamState: [1, 2, 3].map((i) => createTeamStateEntity(i)),
        })
      );
      const state = teamStateReducer(preloaded, TeamStateActions.removeFromTeam({ id: 2 }));
      expect(state.ids).toEqual([1, 3]);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action;

      const result = teamStateReducer(initialTeamStateState, action);

      expect(result).toBe(initialTeamStateState);
    });
  });
});
