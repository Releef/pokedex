import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';

import * as PokedexStateActions from './pokedex.actions';

import { Pokemon } from '@pokedex/types';

export const POKEDEX_STATE_FEATURE_KEY = 'pokedexState';

export interface PokedexStateState extends EntityState<Pokemon> {
  selectedId?: string | number;
  loaded: boolean;
  loading: boolean;
  error?: string | null;
  query: string;
  offset: number;
  limit: number;
  total: number;
}

export interface PokedexStatePartialState {
  readonly [POKEDEX_STATE_FEATURE_KEY]: PokedexStateState;
}

export const pokedexStateAdapter: EntityAdapter<Pokemon> =
  createEntityAdapter<Pokemon>();

export const initialPokedexStateState: PokedexStateState =
  pokedexStateAdapter.getInitialState({
    loaded: false,
    loading: false,
    error: null,
    query: '',
    offset: 0,
    limit: 1400,
    total: 0,
  });

const reducer = createReducer(
  initialPokedexStateState,
  on(PokedexStateActions.initPokedex, (state) => ({
    ...state,
    loaded: false,
    loading: true,
    error: null,
    offset: 0,
  })),
  on(PokedexStateActions.setQuery, (state, { query }) => ({
    ...state,
    query,
    loaded: false,
    loading: true,
    error: null,
    offset: 0,
  })),
  on(PokedexStateActions.loadPage, (state, { offset, limit }) => ({
    ...state,
    loading: true,
    offset,
    limit,
  })),
  on(PokedexStateActions.loadPageSuccess, (state, { items, offset, limit, total }) => {
    const base = { ...state, loading: false, loaded: true, offset, limit, total: total ?? state.total };
    return offset === 0
      ? pokedexStateAdapter.setAll(items, base)
      : pokedexStateAdapter.addMany(items, base);
  }),
  // Legacy support: allow tests to dispatch loadPokedexSuccess which replaces the list
  on(PokedexStateActions.loadPokedexSuccess, (state, { pokedexState }) =>
    pokedexStateAdapter.setAll(pokedexState, { ...state, loading: false, loaded: true })
  ),
  on(PokedexStateActions.loadPokedexStateFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);

export function pokedexStateReducer(
  state: PokedexStateState | undefined,
  action: Action
) {
  return reducer(state, action);
}
