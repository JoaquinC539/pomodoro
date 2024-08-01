import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {MatDialog,MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';


@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent {

  @Input() currentPomodoroClass:string="pomodoro_focus";
  constructor(){
    
  }
  
}
