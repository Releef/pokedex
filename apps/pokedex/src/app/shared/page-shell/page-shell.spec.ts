import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageShellComponent } from './page-shell';

@Component({
  // Host component to test content projection
  standalone: true,
  imports: [PageShellComponent],
  template: `
    <app-page-shell>
      <span id="nav" nav>NavSlot</span>
      <span id="actions" toolbar-actions>ActionsSlot</span>
      <div id="content">MainContent</div>
    </app-page-shell>
  `,
})
class HostProjectionComponent {}

describe('PageShell', () => {
  describe('basic rendering', () => {
    let fixture: ComponentFixture<PageShellComponent>;
    let component: PageShellComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [PageShellComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(PageShellComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('renders title from signal in the toolbar', () => {
      const host: HTMLElement = fixture.nativeElement as HTMLElement;
      // Initially empty title
      expect(host.querySelector('mat-toolbar span')?.textContent?.trim()).toBe('');

      component.title.set('My Title');
      fixture.detectChanges();

      expect(host.querySelector('mat-toolbar span')?.textContent?.trim()).toBe('My Title');
    });

  });

  describe('content projection', () => {
    let fixture: ComponentFixture<HostProjectionComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [HostProjectionComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(HostProjectionComponent);
      fixture.detectChanges();
    });

    it('projects [nav] and [toolbar-actions] into the mat-toolbar', () => {
      const host: HTMLElement = fixture.nativeElement as HTMLElement;
      const toolbar = host.querySelector('mat-toolbar')!;

      // The projected elements should appear inside the toolbar
      const nav = toolbar.querySelector('#nav');
      const actions = toolbar.querySelector('#actions');
      expect(nav).toBeTruthy();
      expect(nav?.textContent).toContain('NavSlot');
      expect(actions).toBeTruthy();
      expect(actions?.textContent).toContain('ActionsSlot');
    });

    it('projects default content below the toolbar (outside mat-toolbar)', () => {
      const host: HTMLElement = fixture.nativeElement as HTMLElement;
      const toolbar = host.querySelector('mat-toolbar')!;
      const content = host.querySelector('#content') as HTMLElement;

      expect(content).toBeTruthy();
      // Ensure content is not inside the toolbar
      expect(toolbar.contains(content)).toBe(false);
      expect(content.textContent).toContain('MainContent');
    });
  });

  describe('edge cases', () => {
    @Component({
      standalone: true,
      imports: [PageShellComponent],
      template: `
        <app-page-shell>
          <div id="content">OnlyDefaultContent</div>
        </app-page-shell>
      `,
    })
    class HostDefaultOnlyComponent {}

    let fixture: ComponentFixture<HostDefaultOnlyComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [HostDefaultOnlyComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(HostDefaultOnlyComponent);
      fixture.detectChanges();
    });

    it('renders correctly when optional slots are not provided', () => {
      const hostEl = fixture.nativeElement as HTMLElement;
      const toolbar = hostEl.querySelector('mat-toolbar')!;
      expect(toolbar).toBeTruthy();
      expect(toolbar.querySelector('#nav')).toBeNull();
      expect(toolbar.querySelector('#actions')).toBeNull();

      const content = hostEl.querySelector('#content')!;
      expect(content.textContent).toContain('OnlyDefaultContent');
      expect(toolbar.contains(content)).toBe(false);
    });
  });
});
