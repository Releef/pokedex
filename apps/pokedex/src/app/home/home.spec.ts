import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Home } from './home';
import {
  initPokedex,
  loadMore,
  selectFilteredCount,
  selectFilteredPokedex,
  setQuery,
} from '@pokedex/pokedex-state';
import { addToTeam, removeFromTeam, selectAllTeamState } from '@pokedex/team-state';
import { Pokemon } from '@pokedex/types';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;
  let store: MockStore;

  const bulbasaur = {
    id: 1,
    name: 'bulbasaur',
    pokemontypes: [{ type: { name: 'grass' } }],
    pokemonmoves: [],
    pokemonstats: [],
    pokemonsprites: [],
  } as unknown as Pokemon;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectFilteredPokedex, value: [bulbasaur] },
            { selector: selectFilteredCount, value: 1 },
            { selector: selectAllTeamState, value: [] },
          ],
        }),
      ],
    })
      .overrideComponent(Home, { set: { template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(Home);
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

  it('pokedexFromStore maps sprite URL using id', () => {
    const items = component.pokedexFromStore();
    expect(items.length).toBe(1);
    expect(items[0].sprite).toContain('/pokemon/1.png');
  });

  it('select sets selected', () => {
    expect(component.selected).toBeNull();
    component.select(bulbasaur);
    expect(component.selected).toEqual(bulbasaur);
  });

  it('onSearchChange dispatches setQuery with trimmed value', () => {
    const spy = jest.spyOn(store, 'dispatch');
    component.onSearchChange('  pika  ');
    expect(spy).toHaveBeenCalledWith(setQuery({ query: 'pika' }));
  });

  it('onIndexChange dispatches loadMore when nearing end', () => {
    const spy = jest.spyOn(store, 'dispatch');
    // set count to 30
    store.overrideSelector(selectFilteredCount, 30);
    store.refreshState();
    component.onIndexChange(20); // 20 > 30 - 15 => true
    expect(spy).toHaveBeenCalledWith(loadMore());
  });

  it('statPercent clamps and rounds to max 100', () => {
    expect(component.statPercent(50)).toBe(Math.round((50 / 120) * 100));
    expect(component.statPercent(200)).toBe(100);
  });

  it('isTeamFull and isInTeam reflect team selector and selection', () => {
    // Initially empty team
    expect(component.isTeamFull()).toBe(false);
    component.select(bulbasaur);
    expect(component.isInTeam()).toBe(false);

    // Team has 5 members including selected
    store.overrideSelector(selectAllTeamState, [
      { id: 1, name: 'bulbasaur' },
      { id: 2, name: 'ivysaur' },
      { id: 3, name: 'venusaur' },
      { id: 4, name: 'charmander' },
      { id: 5, name: 'squirtle' },
    ]);
    store.refreshState();

    expect(component.isTeamFull()).toBe(true);
    expect(component.isInTeam()).toBe(true);
  });

  it('addSelectedToTeam dispatches when eligible and respects guards', () => {
    const spy = jest.spyOn(store, 'dispatch');

    // No selection => no dispatch
    component.selected = null;
    component.addSelectedToTeam();
    expect(spy).not.toHaveBeenCalled();

    // Selected but team full => no dispatch
    component.selected = bulbasaur;
    store.overrideSelector(selectAllTeamState, [
      { id: 1, name: 'bulbasaur' },
      { id: 2, name: 'ivysaur' },
      { id: 3, name: 'venusaur' },
      { id: 4, name: 'charmander' },
      { id: 5, name: 'squirtle' },
    ]);
    store.refreshState();
    component.addSelectedToTeam();

    // Not called due to full team
    expect(spy).not.toHaveBeenCalledWith(addToTeam(expect.anything()));

    // Space available but selected already in team => no dispatch
    store.overrideSelector(selectAllTeamState, [
      { id: 1, name: 'bulbasaur' },
    ]);
    store.refreshState();
    component.addSelectedToTeam();
    expect(spy).not.toHaveBeenCalledWith(addToTeam(expect.anything()));

    // Not in team and space available => dispatch
    store.overrideSelector(selectAllTeamState, []);
    store.refreshState();
    component.addSelectedToTeam();
    expect(spy).toHaveBeenCalledWith(
      addToTeam({ member: { id: 1, name: 'bulbasaur' } })
    );
  });

  it('removeSelectedFromTeam dispatches only if selected is in team', () => {
    const spy = jest.spyOn(store, 'dispatch');

    // No selection
    component.selected = null;
    component.removeSelectedFromTeam();
    expect(spy).not.toHaveBeenCalled();

    // Selected but not in team
    component.selected = bulbasaur;
    store.overrideSelector(selectAllTeamState, []);
    store.refreshState();
    component.removeSelectedFromTeam();
    expect(spy).not.toHaveBeenCalledWith(removeFromTeam(expect.anything()));

    // Selected and in team
    store.overrideSelector(selectAllTeamState, [{ id: 1, name: 'bulbasaur' }]);
    store.refreshState();
    component.removeSelectedFromTeam();
    expect(spy).toHaveBeenCalledWith(removeFromTeam({ id: 1 }));
  });

  it('typeClass returns expected class names', () => {
    expect(component.typeClass('grass')).toContain('green');
    expect(component.typeClass('FIRE')).toContain('orange');
    expect(component.typeClass('unknown')).toContain('gray');
  });
});
