import { Component, input, output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardAvatar,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatChip, MatChipSet } from '@angular/material/chips';
import { MatDivider } from '@angular/material/divider';
import { MatProgressBar } from '@angular/material/progress-bar';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { Pokemon } from '@pokedex/types';
import { MatList, MatListItem } from '@angular/material/list';
import { typeClass } from '@pokedex/utility';

@Component({
  selector: 'app-pokemon-details',
  imports: [
    MatButton,
    MatCard,
    MatCardActions,
    MatCardAvatar,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatChip,
    MatChipSet,
    MatDivider,
    MatIcon,
    MatProgressBar,
    NgOptimizedImage,
    NgClass,
    MatList,
    MatListItem,
  ],
  templateUrl: './pokemon-details.html',
})
export class PokemonDetails {
  pokemon = input<Pokemon | null>(null);
  inTeam = input(false);
  canAddToTeam = input(true);
  showAddButton = input(false);

  addRequested = output<void>();
  removeRequested = output<void>();

  statPercent(value: number): number {
    const max = 120;
    return Math.min(100, Math.round((value / max) * 100));
  }

  protected readonly typeClass = typeClass;
}
