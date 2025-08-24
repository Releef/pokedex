import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jasmine-marbles';
import { Observable, of } from 'rxjs';

import * as PokedexStateActions from './pokedex.actions';
import { PokedexStateEffects } from './pokedex-state.effects';
import { Apollo } from 'apollo-angular';
import { initialPokedexStateState } from './pokedex-state.reducer';

describe('PokedexStateEffects', () => {
  let actions: Observable<Action>;
  let effects: PokedexStateEffects;

  beforeEach(() => {
    const apolloMock = {
      query: jest.fn().mockReturnValue(of({ data: { pokemon: [] } })),
    } as unknown as Apollo;

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        PokedexStateEffects,
        provideMockActions(() => actions),
        provideMockStore({ initialState: { pokedexState: initialPokedexStateState } }),
        { provide: Apollo, useValue: apolloMock },
      ],
    });

    effects = TestBed.inject(PokedexStateEffects);
  });

  describe('init$', () => {
    it('should dispatch loadPage on init', () => {
      actions = hot('-a-|', { a: PokedexStateActions.initPokedex() });

      const expected = hot('-a-|', {
        a: PokedexStateActions.loadPage({ offset: 0, limit: 1400 }),
      });

      expect(effects.init$).toBeObservable(expected);
    });
  });

  describe('setQuery$', () => {
    it('should dispatch loadPage on setQuery with limit from store', () => {
      actions = hot('-a-|', { a: PokedexStateActions.setQuery({ query: 'pik' }) });
      const expected = hot('-a-|', {
        a: PokedexStateActions.loadPage({ offset: 0, limit: 1400 }),
      });
      expect(effects.setQuery$).toBeObservable(expected);
    });
  });

  describe('loadMore$', () => {
    it('should dispatch loadPage with offset=count when not loading and hasMore', () => {
      actions = hot('-a-|', { a: PokedexStateActions.loadMore() });
      const expected = hot('-a-|', {
        a: PokedexStateActions.loadPage({ offset: 0, limit: 1400 }),
      });
      expect(effects.loadMore$).toBeObservable(expected);
    });
  });
});
