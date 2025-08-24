import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';

import * as TeamStateActions from './team-state.actions';
import { TeamStateEffects } from './team-state.effects';

describe('TeamStateEffects', () => {
  let actions: Observable<Action>;
  let effects: TeamStateEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        TeamStateEffects,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });

    effects = TestBed.inject(TeamStateEffects);
  });

  describe('init$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: TeamStateActions.initTeamState() });

      const expected = hot('-a-|', {
        a: TeamStateActions.loadTeamStateSuccess({ teamState: [] }),
      });

      expect(effects.init$).toBeObservable(expected);
    });
  });
});
