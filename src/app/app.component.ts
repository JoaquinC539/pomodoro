import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from "./components/nav/nav.component";
import { TimerComponent } from "./components/timer/timer.component";
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent, TimerComponent,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  
  currentPomodoroClass:string="pomodoro_focus";

  getPomodoroClass($event:string){
    
    this.currentPomodoroClass=$event;
  }
  

  
}
