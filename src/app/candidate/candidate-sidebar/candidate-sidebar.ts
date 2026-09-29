import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-candidate-sidebar',
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './candidate-sidebar.html',
  styleUrl: './candidate-sidebar.css',
})
export class CandidateSidebar {

  isCollapsed = false;

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

}
