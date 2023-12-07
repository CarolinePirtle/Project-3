import { Component } from '@angular/core';

@Component({
  selector: 'app-gps-interface',
  standalone: true,
  imports: [],
  template: `
  <section>
    <form>
      <input type="text" placeholder="Enter time to convert">
      <button (click)=" testClick()" class="primary" type="button">Convert</button>
    </form>
  </section>
  <h2>
`,
  styleUrl: './gps-interface.component.css'
})
export class GpsInterfaceComponent {
  testClick() {
    alert("Clicked");
  }
}
