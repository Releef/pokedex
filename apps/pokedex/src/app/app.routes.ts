import { Route } from '@angular/router';
import { Home } from './home/home';
import { Team } from './team/team';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import {
  POKEDEX_STATE_FEATURE_KEY,
  PokedexStateEffects,
  pokedexStateReducer,
} from '@pokedex/pokedex-state';
import {
  TEAM_STATE_FEATURE_KEY,
  TeamStateEffects,
  teamStateReducer,
} from '@pokedex/team-state';

export const appRoutes: Route[] = [
  {
    path: '',
    component: Home,
    providers: [
      provideState(POKEDEX_STATE_FEATURE_KEY, pokedexStateReducer),
      provideEffects(PokedexStateEffects),
      provideState(TEAM_STATE_FEATURE_KEY, teamStateReducer),
      provideEffects(TeamStateEffects),
    ],
  },
  {
    path: 'team',
    component: Team,
    providers: [
      provideState(POKEDEX_STATE_FEATURE_KEY, pokedexStateReducer),
      provideEffects(PokedexStateEffects),
      provideState(TEAM_STATE_FEATURE_KEY, teamStateReducer),
      provideEffects(TeamStateEffects),
    ],
  },
];
