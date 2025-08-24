import { Component, input, output } from '@angular/core';
import {
  MatList,
  MatListItem,
  MatListItemAvatar,
  MatListItemLine,
  MatListItemTitle,
} from '@angular/material/list';
import { NgClass, NgOptimizedImage } from '@angular/common';
import {
  CdkFixedSizeVirtualScroll,
  CdkVirtualForOf,
  CdkVirtualScrollViewport,
} from '@angular/cdk/scrolling';
import { Pokemon } from '@pokedex/types';

@Component({
  selector: 'app-pokemon-list',
  imports: [
    CdkFixedSizeVirtualScroll,
    CdkVirtualForOf,
    CdkVirtualScrollViewport,
    MatList,
    MatListItem,
    MatListItemAvatar,
    MatListItemLine,
    MatListItemTitle,
    NgOptimizedImage,
    NgClass,
  ],
  templateUrl: './pokemon-list.html',
})
export class PokemonList {
  title = input.required<string>();
  items = input.required<Pokemon[]>();
  count = input.required<number>();
  selectedId = input<number | null | undefined>();
  itemSize = input(64);
  viewportClass = input('flex-1');

  itemSelected = output<Pokemon>();
  scrolledIndexChange = output<number>();

  trackById = (_: number, p: Pokemon) => p.id;
}
