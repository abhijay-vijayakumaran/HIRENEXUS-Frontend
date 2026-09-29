import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { routeAnimation } from './app.animations';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
  animations: [routeAnimation]
})
export class App {
  protected readonly title = signal('hirenexux-frontend');
}
