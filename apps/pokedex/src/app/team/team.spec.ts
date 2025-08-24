import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Team } from './team';
import { initPokedex, selectPokedexStateEntities } from '@pokedex/pokedex-state';
import { removeFromTeam, selectAllTeamState } from '@pokedex/team-state';
import { Pokemon } from '@pokedex/types';

describe('Team', () => {
  let component: Team;
  let fixture: ComponentFixture<Team>;
  let store: MockStore;

  const bulbasaur = { id: 1, name: 'Bulbasaur', pokemontypes: [], pokemonmoves: [], pokemonstats: [], pokemonsprites: [] } as unknown as Pokemon;
  const ivysaur = { id: 2, name: 'Ivysaur', pokemontypes: [], pokemonmoves: [], pokemonstats: [], pokemonsprites: [] } as unknown as Pokemon;
  const charmander = { id: 3, name: 'Charmander', pokemontypes: [], pokemonmoves: [], pokemonstats: [], pokemonsprites: [] } as unknown as Pokemon;

  const entities = {
    1: bulbasaur,
    2: ivysaur,
    3: charmander,
  } as Record<number, Pokemon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Team],
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectAllTeamState, value: [{ id: 1, name: 'Bulbasaur' }, { id: 2, name: 'Ivysaur' }, { id: 3, name: 'Charmander' }] },
            { selector: selectPokedexStateEntities, value: entities },
          ],
        }),
      ],
    })
      .overrideComponent(Team, { set: { template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(Team);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('dispatches initPokedex on init', () => {
    const spy = jest.spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(spy).toHaveBeenCalledWith(initPokedex());
  });

  it('teamList maps team members to full Pokemon', () => {
    const list = component.teamList();
    expect(list.map((p) => p.id)).toEqual([1, 2, 3]);
  });

  it('$count reflects teamList length', () => {
    expect(component.$count()).toBe(3);
  });

  it('select sets selected', () => {
    component.select(ivysaur);
    expect(component.selected).toEqual(ivysaur);
  });

  it('removeSelectedFromTeam does nothing when no selection', () => {
    const spy = jest.spyOn(store, 'dispatch');
    component.selected = null;
    component.removeSelectedFromTeam();
    expect(spy).not.toHaveBeenCalled();
  });

  it('removeSelectedFromTeam removes only member and clears selection', () => {
    // Set store to single member team [1]
    store.overrideSelector(selectAllTeamState, [{ id: 1, name: 'Bulbasaur' }]);
    store.refreshState();
    component.select(bulbasaur);

    const spy = jest.spyOn(store, 'dispatch').mockImplementation((action: any) => {
      if (action.type === removeFromTeam.type) {
        // After removal, team becomes empty
        store.overrideSelector(selectAllTeamState, []);
        store.refreshState();
      }
      return action as any;
    });

    component.removeSelectedFromTeam();

    expect(spy).toHaveBeenCalledWith(removeFromTeam({ id: 1 }));
    expect(component.selected).toBeNull();
  });

  it('removeSelectedFromTeam selects adjacent item when list remains', () => {
    // Start with [1,2,3]
    store.overrideSelector(selectAllTeamState, [
      { id: 1, name: 'Bulbasaur' },
      { id: 2, name: 'Ivysaur' },
      { id: 3, name: 'Charmander' },
    ]);
    store.refreshState();
    component.select(ivysaur); // idx = 1

    jest.spyOn(store, 'dispatch').mockImplementation((action: any) => {
      if (action.type === removeFromTeam.type) {
        // After removal of id 2, team becomes [1,3]
        store.overrideSelector(selectAllTeamState, [
          { id: 1, name: 'Bulbasaur' },
          { id: 3, name: 'Charmander' },
        ]);
        store.refreshState();
      }
      return action as any;
    });

    component.removeSelectedFromTeam();

    expect(component.selected?.id).toBe(3); // adjacent selection (same index -> Charmander)
  });
});
