import { TeamStateEntity } from './team-state.models';
import {
  teamStateAdapter,
  TeamStatePartialState,
  initialTeamStateState,
} from './team-state.reducer';
import * as TeamStateSelectors from './team-state.selectors';

describe('TeamState Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getTeamStateId = (it: TeamStateEntity) => it.id;
  const createTeamStateEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as TeamStateEntity);

  let state: TeamStatePartialState;

  beforeEach(() => {
    state = {
      teamState: teamStateAdapter.setAll(
        [
          createTeamStateEntity('PRODUCT-AAA'),
          createTeamStateEntity('PRODUCT-BBB'),
          createTeamStateEntity('PRODUCT-CCC'),
        ],
        {
          ...initialTeamStateState,
          selectedId: 'PRODUCT-BBB',
          error: ERROR_MSG,
          loaded: true,
        }
      ),
    };
  });

  describe('TeamState Selectors', () => {
    it('selectAllTeamState() should return the list of TeamState', () => {
      const results = TeamStateSelectors.selectAllTeamState(state);
      const selId = getTeamStateId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('selectEntity() should return the selected Entity', () => {
      const result = TeamStateSelectors.selectEntity(state) as TeamStateEntity;
      const selId = getTeamStateId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it('selectTeamStateLoaded() should return the current "loaded" status', () => {
      const result = TeamStateSelectors.selectTeamStateLoaded(state);

      expect(result).toBe(true);
    });

    it('selectTeamStateError() should return the current "error" state', () => {
      const result = TeamStateSelectors.selectTeamStateError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
