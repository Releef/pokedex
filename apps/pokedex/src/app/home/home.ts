import { Component, inject, OnInit, computed, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Store } from '@ngrx/store';
import {
  initPokedex,
  loadMore,
  selectAllPokedex,
  selectCount,
  selectLoaded,
} from '@pokedex/pokedex-state';
import { Pokemon } from '@pokedex/types';
import { RouterModule } from '@angular/router';
import { addToTeam, removeFromTeam, selectAllTeamState } from '@pokedex/team-state';
import { PageShellComponent } from '../shared/page-shell/page-shell';
import { PokemonList } from '../shared/pokemon-list/pokemon-list';
import { PokemonDetails } from '../shared/pokemon-details/pokemon-details';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatButtonModule,
    MatChipsModule,
    MatCardModule,
    MatDividerModule,
    MatProgressBarModule,
    MatSidenavModule,
    ScrollingModule,
    RouterModule,
    PageShellComponent,
    PokemonDetails,
    PokemonList,
  ],
  templateUrl: './home.html',
})
export class Home implements OnInit {
  private readonly _store = inject(Store);
  $pokedex = this._store.selectSignal(selectAllPokedex);
  $count = this._store.selectSignal(selectCount);
  $loaded = this._store.selectSignal(selectLoaded);

  // Keep string for template binding and tests; use searchSignal for reactivity
  search = '';
  searchSignal = signal<string>('');

  // Local UI state for filtering and sorting (signals to drive reactivity)
  selectedType = signal<string | null>(null);
  sortBy = signal<'id' | 'name' | 'type'>('id');
  sortDir = signal<'asc' | 'desc'>('asc');

  // Map store items (id/name) to view model with sprite
  pokedexFromStore = computed<Pokemon[]>(() =>
    this.$pokedex().map((p) => {
      const idNum = Number(p.id);
      return {
        ...p,
        sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${idNum}.png`,
      } as Pokemon;
    })
  );

  // Distinct type list from current list
  types = computed<string[]>(() => {
    const set = new Set<string>();
    for (const p of this.pokedexFromStore()) {
      for (const pt of p.pokemontypes ?? []) {
        const name = pt?.type?.name;
        if (name) set.add(name);
      }
    }
    return Array.from(set).sort();
  });

  private primaryType(p: Pokemon): string {
    const names = (p.pokemontypes ?? [])
      .map((t) => t?.type?.name ?? '')
      .filter(Boolean)
      .sort();
    return names[0] ?? '';
  }

  typeClass(t: string | null | undefined): string {
    const key = (t ?? '').toString().toLowerCase();
    switch (key) {
      case 'grass':
        return 'type-chip--grass green';
      case 'fire':
        return 'type-chip--fire orange';
      case 'water':
        return 'type-chip--water blue';
      case 'electric':
        return 'type-chip--electric yellow';
      case 'poison':
        return 'type-chip--poison purple';
      case 'ghost':
        return 'type-chip--ghost indigo';
      case 'normal':
        return 'type-chip--normal gray';
      case 'fairy':
        return 'type-chip--fairy pink';
      default:
        return 'type-chip--default gray';
    }
  }

  filteredSorted = computed<Pokemon[]>(() => {
    let list = this.pokedexFromStore();

    // Scope by selected type first
    const selType = this.selectedType();
    if (selType) {
      list = list.filter((p) => (p.pokemontypes ?? []).some((t) => t?.type?.name === selType));
    }

    // Local search filters the shown list only (name, #id, or type)
    const term = (this.searchSignal() ?? '').trim().toLowerCase();
    if (term) {
      const isNumeric = /^#?\d+$/.test(term);
      const numericTerm = term.replace('#', '');
      list = list.filter((p) => {
        const nameMatch = p.name?.toLowerCase().includes(term);
        const idMatch = isNumeric ? String(p.id).includes(numericTerm) : false;
        const typeMatch = Array.isArray(p.pokemontypes)
          ? p.pokemontypes.some((pt) => pt?.type?.name?.toLowerCase().includes(term))
          : false;
        return Boolean(nameMatch || idMatch || typeMatch);
      });
    }

    // Sorting applies in real time on the currently visible list
    const dir = this.sortDir() === 'asc' ? 1 : -1;
    const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

    const getKey = (p: Pokemon): string | number => {
      switch (this.sortBy()) {
        case 'id':
          return p.id;
        case 'name':
          return p.name ?? '';
        case 'type':
          return this.primaryType(p);
      }
    };

    return [...list].sort((a, b) => {
      const ka = getKey(a);
      const kb = getKey(b);
      if (typeof ka === 'number' && typeof kb === 'number') {
        return (ka - kb) * dir;
      }
      return collator.compare(String(ka), String(kb)) * dir;
    });
  });

  selected: Pokemon | null = null;

  // Auto-select the first Pokémon in the list whenever the list changes
  // - If the list is empty, clear the selection
  // - If current selection is not in the new (possibly filtered) list, select the first item
  // - If current selection exists in the list, keep it
  autoSelectEffect = effect(() => {
    // Wait until the list is loaded before auto-selecting
    if (!this.$loaded()) return;

    const list = this.filteredSorted();
    const current = this.selected;

    if (!Array.isArray(list) || list.length === 0) {
      if (current !== null) this.selected = null;
      return;
    }

    const hasCurrent = !!current && list.some((p) => String(p.id) === String(current.id));
    if (!hasCurrent) {
      this.selected = list[0];
    }
  });

  ngOnInit() {
    this._store.dispatch(initPokedex());
  }

  select(p: Pokemon) {
    this.selected = p;
  }

  onSearchChange(term: string) {
    const value = (term ?? '').toString().trim();
    this.search = value;
    this.searchSignal.set(value);
  }

  onIndexChange(index: number) {
    const length = this.$count();
    if (index > length - 15) {
      this._store.dispatch(loadMore());
    }
  }

  statPercent(value: number): number {
    const max = 120;
    return Math.min(100, Math.round((value / max) * 100));
  }

  // Team state signals and helpers
  $team = this._store.selectSignal(selectAllTeamState);

  isTeamFull(): boolean {
    return this.$team().length >= 5;
  }

  isInTeam(): boolean {
    const sel = this.selected;
    if (!sel) return false;
    return this.$team().some((m) => String(m.id) === String(sel.id));
  }

  addSelectedToTeam() {
    const sel = this.selected;
    if (!sel) return;
    if (this.isTeamFull() || this.isInTeam()) return;
    this._store.dispatch(addToTeam({ member: { id: sel.id, name: sel.name } }));
  }

  removeSelectedFromTeam() {
    const sel = this.selected;
    if (!sel) return;
    if (!this.isInTeam()) return;
    this._store.dispatch(removeFromTeam({ id: sel.id }));
  }

}
