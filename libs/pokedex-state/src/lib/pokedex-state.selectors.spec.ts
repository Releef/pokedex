import { Pokemon } from '@pokedex/types';
import {
  pokedexStateAdapter,
  PokedexStatePartialState,
  initialPokedexStateState,
} from './pokedex-state.reducer';
import * as PokedexStateSelectors from './pokedex-state.selectors';

function makePokemon(id: number, name = `name-${id}`, type = 'normal'): Pokemon {
  return {
    id,
    name,
    pokemontypes: [{ type: { name: type } }],
    pokemonmoves: [],
    pokemonstats: [],
    pokemonsprites: [{ sprites: { front_default: null, front_shiny: null, front_female: null, front_shiny_female: null, back_default: null, back_shiny: null, back_female: null, back_shiny_female: null, other: null, versions: null } }],
  } as unknown as Pokemon;
}

describe('PokedexState Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getId = (it: Pokemon) => it.id;

  let state: PokedexStatePartialState;

  beforeEach(() => {
    state = {
      pokedexState: pokedexStateAdapter.setAll(
        [makePokemon(1, 'AAA'), makePokemon(2, 'BBB'), makePokemon(3, 'CCC')],
        {
          ...initialPokedexStateState,
          selectedId: 2,
          error: ERROR_MSG,
          loaded: true,
        }
      ),
    };
  });

  describe('PokedexState Selectors', () => {
    it('selectAllPokedexState() should return the list of Pokemon', () => {
      const results = PokedexStateSelectors.selectAllPokedexState(state);
      const selId = getId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe(2);
    });

    it('selectEntity() should return the selected Entity', () => {
      const result = PokedexStateSelectors.selectEntity(state) as Pokemon;
      const selId = getId(result);

      expect(selId).toBe(2);
    });

    it('selectPokedexStateLoaded() should return the current "loaded" status', () => {
      const result = PokedexStateSelectors.selectPokedexStateLoaded(state);
      expect(result).toBe(true);
    });

    it('selectPokedexStateError() should return the current "error" state', () => {
      const result = PokedexStateSelectors.selectPokedexStateError(state);
      expect(result).toBe(ERROR_MSG);
    });

    it('selectFilteredPokedex() should filter by name and id and type', () => {
      let result = PokedexStateSelectors.selectFilteredPokedex.projector(
        [makePokemon(10, 'Pika'), makePokemon(25, 'Raichu'), makePokemon(7, 'Squirtle', 'water')],
        ''
      );
      expect(result.length).toBe(3);

      result = PokedexStateSelectors.selectFilteredPokedex.projector(
        [makePokemon(10, 'Pika'), makePokemon(25, 'Raichu'), makePokemon(7, 'Squirtle', 'water')],
        'pika'
      );
      expect(result.map((p) => p.name)).toContain('Pika');

      result = PokedexStateSelectors.selectFilteredPokedex.projector(
        [makePokemon(10, 'Pika'), makePokemon(25, 'Raichu'), makePokemon(7, 'Squirtle', 'water')],
        '#25'
      );
      expect(result.length).toBe(1);
      expect(result[0].id).toBe(25);

      result = PokedexStateSelectors.selectFilteredPokedex.projector(
        [makePokemon(10, 'Pika'), makePokemon(25, 'Raichu'), makePokemon(7, 'Squirtle', 'water')],
        'water'
      );
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Squirtle');
    });

    it('selectHasMore() should evaluate based on total and count', () => {
      expect(PokedexStateSelectors.selectHasMore.projector(0, 10)).toBe(true);
      expect(PokedexStateSelectors.selectHasMore.projector(5, 10)).toBe(true);
      expect(PokedexStateSelectors.selectHasMore.projector(10, 10)).toBe(false);
    });
  });
});
