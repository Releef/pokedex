import { Component, OnInit, computed, inject } from '@angular/core';
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
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Pokemon } from '@pokedex/types';
import { selectAllTeamState, removeFromTeam } from '@pokedex/team-state';
import { initPokedex } from '@pokedex/pokedex-state';
import { selectPokedexStateEntities } from '@pokedex/pokedex-state';
import { PageShellComponent } from '../shared/page-shell/page-shell';
import { PokemonList } from '../shared/pokemon-list/pokemon-list';
import { PokemonDetails } from '../shared/pokemon-details/pokemon-details';

@Component({
  selector: 'app-team',
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
    PokemonList,
    PokemonDetails,
  ],
  templateUrl: './team.html',
})
export class Team implements OnInit {
  private readonly _store = inject(Store);

  $teamMembers = this._store.selectSignal(selectAllTeamState);
  $pokedexEntities = this._store.selectSignal(selectPokedexStateEntities);

  search = '';
  selected: Pokemon | null = null;

  teamList = computed<Pokemon[]>(() => {
    const entities = this.$pokedexEntities();
    const full = this.$teamMembers()
      .map((m) => entities[m.id])
      .filter((p): p is Pokemon => !!p);

    const term = this.search.trim().toLowerCase();
    if (!term) return full;
    return full.filter(
      (p) => p.name.toLowerCase().includes(term) || String(p.id) === term
    );
  });

  $count = computed(() => this.teamList().length);

  ngOnInit(): void {
    // Ensure pokedex is loaded so we have full Pokemon details
    this._store.dispatch(initPokedex());
  }

  select(p: Pokemon) {
    this.selected = p;
  }

  removeSelectedFromTeam() {
    const sel = this.selected;
    if (!sel) return;

    const prevList = this.teamList();
    const idx = prevList.findIndex((p) => String(p.id) === String(sel.id));

    this._store.dispatch(removeFromTeam({ id: sel.id }));

    const newList = this.teamList();
    if (newList.length === 0) {
      this.selected = null;
    } else {
      const newIndex = Math.min(Math.max(idx, 0), newList.length - 1);
      this.selected = newList[newIndex] ?? null;
    }
  }
}
