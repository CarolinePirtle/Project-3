import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { GpsInterfaceComponent } from './gps-interface/gps-interface.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, GpsInterfaceComponent],
  template: `
  <main>
    <header class="brand-name">
      <img class="brand-logo" src="/favicon.ico" alt="logo" aria-hidden="true">
    </header>
    <section class="content">
      <app-gps-interface></app-gps-interface>
    </section>
  </main>
`,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'gps-app';
}
