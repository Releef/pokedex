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

  typeClass(type: string): string {
    switch ((type || '').toLowerCase()) {
      case 'grass':
        return 'bg-green-100 text-green-800';
      case 'poison':
        return 'bg-purple-100 text-purple-800';
      case 'fire':
        return 'bg-orange-100 text-orange-800';
      case 'water':
        return 'bg-blue-100 text-blue-800';
      case 'electric':
        return 'bg-yellow-100 text-yellow-800';
      case 'normal':
        return 'bg-gray-200 text-gray-800';
      case 'fairy':
        return 'bg-pink-100 text-pink-800';
      case 'ghost':
        return 'bg-violet-100 text-violet-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
