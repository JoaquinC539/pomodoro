import { CommonModule, isPlatformBrowser} from '@angular/common';
import { Component, OnInit, Output,EventEmitter, afterNextRender, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DbService } from '../../../services/db.service';
import { InitService } from '../../../services/init.service';
import { Timer } from '../../../interfaces/Timer';


@Component({
  selector: 'app-modal-timer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-timer.component.html',
  styleUrl: './modal-timer.component.scss'
})
export class ModalTimerComponent implements OnInit,AfterViewInit {
  @Output() changedSettings:EventEmitter<Timer[]>;

  durationForm: FormGroup;
  tFocus?:Timer;
  tShort?:Timer;
  tLong?:Timer;
  

  constructor(private _dbService: DbService, private _initService: InitService,
    @Inject(PLATFORM_ID) private platform_id:Object) { 
    this.changedSettings=new EventEmitter();   
    this.durationForm = new FormGroup({
      focus: new FormControl(),
      short: new FormControl(),
      long: new FormControl()
    })
  }
  ngOnInit(): void {
    
    

  }
  ngAfterViewInit(): void {
      if(isPlatformBrowser(this.platform_id)){
        this._initService.parentInit$.subscribe(async (parentInit) => {
          if (parentInit) {
            const timerData = await this._dbService.getTimers();
            this.tFocus=timerData.find(t => t.name === "focus");
            this.tShort=timerData.find(t => t.name === "srest");
            this.tLong=timerData.find(t => t.name === "lrest");
            this.durationForm.patchValue({
              "focus": timerData.find(t => t.name === "focus")!.durationInSeconds / 60,
              "short": timerData.find(t => t.name === "srest")!.durationInSeconds / 60,
              "long": timerData.find(t => t.name === "lrest")!.durationInSeconds / 60
            });
          }
        });
      }
  }
  
  submitForm($event: any) {
    $event.preventDefault();    
    const timers:Timer[]=[];
    const timerFocus:Timer=this.tFocus!    
    timerFocus.durationInSeconds=Number(this.durationForm.value["focus"])*60
    const timerShort:Timer=this.tShort!
    timerShort.durationInSeconds=Number(this.durationForm.value["short"])*60
    const timerLong:Timer=this.tLong!
    timerLong.durationInSeconds=Number(this.durationForm.value["long"])*60
    timers.push(timerFocus,timerShort,timerLong)    
    this._dbService.updatetimers(timers);
    this.changedSettings.next(timers);
  }

}
