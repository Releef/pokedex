import { createAction, props } from '@ngrx/store';
import { Pokemon } from '@pokedex/types';

export const initPokedex = createAction('[Pokedex Home] Init');

export const setQuery = createAction(
  '[Pokedex] Set Query',
  props<{ query: string }>()
);

export const loadPage = createAction(
  '[Pokedex/API] Load Page',
  props<{ offset: number; limit: number }>()
);

export const loadMore = createAction('[Pokedex] Load More');

export const loadPageSuccess = createAction(
  '[Pokedex/API] Load Page Success',
  props<{ items: Pokemon[]; offset: number; limit: number; total?: number }>()
);

// Compatibility action for existing tests
export const loadPokedexSuccess = createAction(
  '[Pokedex/API] Load Pokedex Success',
  props<{ pokedexState: Pokemon[] }>()
);

export const loadPokedexStateFailure = createAction(
  '[PokedexState/API] Load PokedexState Failure',
  props<{ error: any }>()
);
