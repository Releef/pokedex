import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  POKEDEX_STATE_FEATURE_KEY,
  PokedexStateState,
  pokedexStateAdapter,
} from './pokedex-state.reducer';

export const selectPokedexStateState = createFeatureSelector<PokedexStateState>(
  POKEDEX_STATE_FEATURE_KEY
);

const { selectAll, selectEntities } = pokedexStateAdapter.getSelectors();

export const selectLoaded = createSelector(
  selectPokedexStateState,
  (state: PokedexStateState) => state.loaded
);

export const selectLoading = createSelector(
  selectPokedexStateState,
  (state: PokedexStateState) => state.loading
);

export const selectError = createSelector(
  selectPokedexStateState,
  (state: PokedexStateState) => state.error
);

export const selectAllPokedex = createSelector(
  selectPokedexStateState,
  (state: PokedexStateState) => selectAll(state)
);

export const selectCount = createSelector(selectAllPokedex, (arr) => arr.length);

export const selectQuery = createSelector(
  selectPokedexStateState,
  (state: PokedexStateState) => state.query
);

// Filtered list by query: supports name, #id or id digits, and type
export const selectFilteredPokedex = createSelector(
  selectAllPokedex,
  selectQuery,
  (list, query) => {
    const term = (query ?? '').trim().toLowerCase();
    if (!term) return list;

    const isNumeric = /^#?\d+$/.test(term);
    const numericTerm = term.replace('#', '');

    return list.filter((p) => {
      const nameMatch = p.name?.toLowerCase().includes(term);
      const idMatch = isNumeric ? String(p.id).includes(numericTerm) : false;
      const typeMatch = Array.isArray(p.pokemontypes)
        ? p.pokemontypes.some((pt) => pt?.type?.name?.toLowerCase().includes(term))
        : false;
      return Boolean(nameMatch || idMatch || typeMatch);
    });
  }
);

export const selectFilteredCount = createSelector(
  selectFilteredPokedex,
  (arr) => arr.length
);

export const selectOffset = createSelector(
  selectPokedexStateState,
  (state: PokedexStateState) => state.offset
);

export const selectLimit = createSelector(
  selectPokedexStateState,
  (state: PokedexStateState) => state.limit
);

export const selectTotal = createSelector(
  selectPokedexStateState,
  (state: PokedexStateState) => state.total
);

export const selectHasMore = createSelector(
  selectCount,
  selectTotal,
  (count, total) => (total > 0 ? count < total : true)
);

// Legacy selector names for backward compatibility with existing tests
export const selectPokedexStateLoaded = selectLoaded;
export const selectPokedexStateError = selectError;
export const selectAllPokedexState = selectAllPokedex;

export const selectPokedexStateEntities = createSelector(
  selectPokedexStateState,
  (state: PokedexStateState) => selectEntities(state)
);

export const selectSelectedId = createSelector(
  selectPokedexStateState,
  (state: PokedexStateState) => state.selectedId
);

export const selectEntity = createSelector(
  selectPokedexStateEntities,
  selectSelectedId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : undefined)
);
