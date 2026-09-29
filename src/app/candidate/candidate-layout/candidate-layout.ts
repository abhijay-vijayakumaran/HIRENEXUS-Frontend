import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CandidateSidebar } from '../candidate-sidebar/candidate-sidebar';

@Component({
  selector: 'app-candidate-layout',
  imports: [RouterOutlet,CandidateSidebar],
  templateUrl: './candidate-layout.html',
  styleUrl: './candidate-layout.css',
})
export class CandidateLayout {

}
