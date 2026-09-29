import { Component } from '@angular/core';
import { Siderbar } from '../siderbar/siderbar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-hr-layout',
  imports: [RouterOutlet,Siderbar],
  templateUrl: './hr-layout.html',
  styleUrl: './hr-layout.css',
})
export class HrLayout {

}
