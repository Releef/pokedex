import { Component, inject, OnInit, computed } from '@angular/core';
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
  setQuery,
  selectFilteredPokedex,
  selectFilteredCount,
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
  $pokedex = this._store.selectSignal(selectFilteredPokedex);
  $count = this._store.selectSignal(selectFilteredCount);

  search = '';

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

  selected: Pokemon | null = null;

  ngOnInit() {
    this._store.dispatch(initPokedex());
  }

  select(p: Pokemon) {
    this.selected = p;
  }

  onSearchChange(term: string) {
    this._store.dispatch(setQuery({ query: term.trim() }));
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
