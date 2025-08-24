import { Action } from '@ngrx/store';

import * as PokedexStateActions from './pokedex.actions';
import { Pokemon } from '@pokedex/types';
import {
  PokedexStateState,
  initialPokedexStateState,
  pokedexStateReducer,
} from './pokedex-state.reducer';

function makePokemon(id: number, name = `name-${id}`): Pokemon {
  return {
    id,
    name,
    pokemontypes: [],
    pokemonmoves: [],
    pokemonstats: [],
    pokemonsprites: [{ sprites: { front_default: null, front_shiny: null, front_female: null, front_shiny_female: null, back_default: null, back_shiny: null, back_female: null, back_shiny_female: null, other: null, versions: null } }],
  } as unknown as Pokemon;
}

describe('PokedexState Reducer', () => {
  describe('valid PokedexState actions', () => {
    it('loadPokedexSuccess should replace list and set loaded', () => {
      const pokedexState: Pokemon[] = [makePokemon(1), makePokemon(2)];
      const action = PokedexStateActions.loadPokedexSuccess({
        pokedexState,
      });

      const result: PokedexStateState = pokedexStateReducer(
        initialPokedexStateState,
        action
      );

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(2);
    });

    it('loadPageSuccess with offset 0 should replace list, >0 should append', () => {
      const first = PokedexStateActions.loadPageSuccess({ items: [makePokemon(1), makePokemon(2)], offset: 0, limit: 2 });
      let state = pokedexStateReducer(initialPokedexStateState, first);
      expect(state.ids.length).toBe(2);

      const more = PokedexStateActions.loadPageSuccess({ items: [makePokemon(3)], offset: 2, limit: 2 });
      state = pokedexStateReducer(state, more);
      expect(state.ids.length).toBe(3);
    });

    it('loadPokedexStateFailure should set error and stop loading', () => {
      const start = PokedexStateActions.initPokedex();
      let state = pokedexStateReducer(initialPokedexStateState, start);
      expect(state.loading).toBe(true);

      const fail = PokedexStateActions.loadPokedexStateFailure({ error: 'x' });
      state = pokedexStateReducer(state, fail);
      expect(state.loading).toBe(false);
      expect(state.error).toBe('x');
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action;

      const result = pokedexStateReducer(initialPokedexStateState, action);

      expect(result).toBe(initialPokedexStateState);
    });
  });
});
