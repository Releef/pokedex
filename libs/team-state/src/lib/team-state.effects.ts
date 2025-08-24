import { Injectable, inject } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { switchMap, catchError, of } from 'rxjs';
import * as TeamStateActions from './team-state.actions';

@Injectable()
export class TeamStateEffects {
  private actions$ = inject(Actions);

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TeamStateActions.initTeamState),
      switchMap(() =>
        of(TeamStateActions.loadTeamStateSuccess({ teamState: [] }))
      ),
      catchError((error) => {
        console.error('Error', error);
        return of(TeamStateActions.loadTeamStateFailure({ error }));
      })
    )
  );
}
