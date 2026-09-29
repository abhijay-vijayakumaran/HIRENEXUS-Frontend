import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-hr-sidebar',
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './siderbar.html',
  styleUrl: './siderbar.css',
})
export class Siderbar {

  isCollapsed = false;

  constructor(private authService:Auth,private router:Router){}

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  logout(){
    this.authService.logout()
    this.router.navigate(['/login'])
  }

}
