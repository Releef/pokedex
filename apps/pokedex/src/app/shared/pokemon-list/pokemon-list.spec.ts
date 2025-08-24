import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PokemonList } from './pokemon-list';

// Provide inputs via host override template to avoid required input errors

describe('PokemonList', () => {
  let component: PokemonList;
  let fixture: ComponentFixture<PokemonList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonList],
    })
      .overrideComponent(PokemonList, {
        set: {
          template: `<div>
            <ng-container>{{ (title() || '') + '' }}</ng-container>
          </div>`,
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(PokemonList);
    component = fixture.componentInstance;
    // Set required inputs before detectChanges via componentRef.setInput
    fixture.componentRef.setInput('title', 't');
    fixture.componentRef.setInput('items', []);
    fixture.componentRef.setInput('count', 0);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
