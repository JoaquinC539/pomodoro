import { Component, Output,EventEmitter, OnInit, afterNextRender, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { PomodoroClass } from '../../enumerables/pomodoroClass';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DbService } from '../../services/db.service';
import { Timer } from '../../interfaces/Timer';
import { MetaData } from '../../interfaces/MetdaData';
import { Title } from '@angular/platform-browser';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ModalTimerComponent } from "./modal-timer/modal-timer.component";
import { InitService } from '../../services/init.service';


@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalTimerComponent],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.scss'
})
export class TimerComponent  implements OnInit,AfterViewInit{
  @Output() classEvent=new EventEmitter<string>();
  currentPomodoroClass:string;
  currentInternalPomodoroClass:string;
  currentButtonTextClass:string;
  focus:boolean;
  srest:boolean;
  rest:boolean;
  lrest:boolean;
  timerSeconds:number;
  timerInScreen:string;
  timerInteval:any
  timers:Array<Timer>|undefined;
  dateHour:MetaData|undefined;
  timerStarted:boolean
  durationForm:FormGroup;

  constructor(private _dbService:DbService,private titleService:Title,private _initService:InitService, 
    @Inject(PLATFORM_ID) private platform_id:Object){
    this.currentPomodoroClass="pomodoro_focus";
    this.currentInternalPomodoroClass="timer_focus"
    this.currentButtonTextClass=PomodoroClass.text_focus
    this.focus=true;
    this.rest=false;
    this.srest=false;
    this.lrest=false;
    this.timerStarted=false;    
    this.timerSeconds=25*60;    
    this.timerInScreen=this.secondsToTimer(this.timerSeconds);
    this.durationForm=new FormGroup({
      focus:new FormControl(),
      short:new FormControl(),
      long:new FormControl()
    })
    
    
  }
  async ngOnInit(): Promise<void> {
    
      
  }
  async ngAfterViewInit(): Promise<void> {
    if(isPlatformBrowser(this.platform_id)){
      await this.checkAndUpdateDate();  
    await this.checkAndSetDefaultTimers();
    this._initService.setParentInitialized();    
    this.setTimerView();
    }
    
  }
  public sendClass(pomodoro_class:string){
    this.currentPomodoroClass=pomodoro_class;
    this.classEvent.emit(this.currentPomodoroClass);
  }
  public swapTheme():void{
    if(this.currentPomodoroClass===PomodoroClass.pomodoro_focus){
      this.currentInternalPomodoroClass=PomodoroClass.timer_rest;
      this.currentButtonTextClass=PomodoroClass.text_rest;
      this.sendClass(PomodoroClass.pomodoro_rest)
    }else{
      this.currentInternalPomodoroClass=PomodoroClass.timer_focus
      this.currentButtonTextClass=PomodoroClass.text_focus
      this.sendClass(PomodoroClass.pomodoro_focus);
    }
  
  }
  public secondsToTimer(seconds:number):string{
    
    let minutes=Math.floor(seconds/60);
    let secondsLeft=seconds-minutes*60;
    return (minutes<10?'0'+minutes:minutes)+":"+(secondsLeft<10?'0'+secondsLeft:secondsLeft);

  }
  public startTimer(stop:boolean=false):void{
    this.playSnap()
    this.timerStarted=true;
    this.timerInteval=setInterval(()=>{
      this.timerInScreen=this.secondsToTimer(this.timerSeconds);
      this.titleService.setTitle(this.timerInScreen);
      this.timerSeconds--;
      if(this.timerSeconds<=0){
        clearInterval(this.timerInteval);
        this.passTimer();
      }
    },1000)
  }
  public pauseTimer(){
    this.playSnap()
    this.timerStarted=false;
    clearInterval(this.timerInteval);
    this.titleService.setTitle("Pomodoro Timer")
    
  }
  public async passTimer(){
    this.timerStarted=false;
    clearInterval(this.timerInteval);
    this.timerStarted=false;    
    await this.handleStageChange();    
  }
  
  public async handleStageChange(){
    this.titleService.setTitle("Pomodoro Timer")
    let pomoCounter=this.dateHour!.pomoCounter;    
    if(this.focus){
      this.playChimes();        
      this.focus=false;
      this.rest=true;
      this.changeIcon("tomato-blue.ico")
      if(pomoCounter%4===0){ 
        this.lrest=true;
        this.srest=false;
      }else{
        
        this.srest=true
        this.lrest=false;        
      }
    }else{
      this.playDrum();
      this.changeIcon("tomato-red.ico")
      await this._dbService.updateCounterPlusOne();
      this.dateHour!.pomoCounter++;
      this.focus=true;
      this.rest=false;
      this.srest=false;
      this.lrest=false;      
    }
    this.swapTheme();
    this.setTimerView();
    
  }
  public async checkAndSetDefaultTimers():Promise<void>{
    const timers=await this._dbService.getTimers();    
    if(timers.length===0){      
      const timerArray:Timer[]=[];
      let ftimer:Timer={
        name:"focus",
        durationInSeconds:25*60
      }
      let stimer:Timer={
        name:"srest",
        durationInSeconds:7*60
      }
      let ltimer:Timer={
        name:"lrest",
        durationInSeconds:20*60
      }
      await this._dbService.addTimer(ftimer)
      await this._dbService.addTimer(stimer)
      await this._dbService.addTimer(ltimer)
      timerArray.push(ftimer,stimer,ltimer);
      this.timers=timerArray;            
    }else{
      this.timers=timers;
    }

  }
  public setTimerView(){

    if(this.focus){
      this.timerSeconds=this.timers?.find(t=>t.name==="focus")?.durationInSeconds!;
    }else if(this.srest){
      this.timerSeconds=this.timers?.find(t=>t.name==="srest")?.durationInSeconds!;
    }else{
      this.timerSeconds=this.timers?.find(t=>t.name==="lrest")?.durationInSeconds!;
    }    
    this.timerInScreen=this.secondsToTimer(this.timerSeconds);    
  }
  

  public async checkAndUpdateDate():Promise<void>{
    const metadate:MetaData|undefined=await this._dbService.getDate();
    const today=this._dbService.getFormattedDate(new Date());
    if(metadate!==undefined){      
      if(today!==metadate.date){
        await this._dbService.setDate(today,1);
        this.dateHour=await this._dbService.getDate();
      }else{
        this.dateHour=metadate;
      }
    }else{
      await this._dbService.setDate(today,1);
      this.dateHour=await this._dbService.getDate();
    }
  }
  public playSnap():void{
    const audio=new Audio('/snap.wav');
    audio.play();
    
  }
  public playChimes():void{    
    const audio=new Audio("/chimes.wav");
    audio.play();
  } 
  public playDrum():void{
    const audio=new Audio("/drum.wav");
    audio.play();
  }
  public async refreshTimers($event:Timer[]):Promise<void>{
    this.pauseTimer();
    this.timers=$event;
    this.setTimerView();
  }
  public changeIcon(iconName:string){
    const link:HTMLLinkElement|null=document.querySelector("link[rel='icon']");    
    if(link!==null){
      link.setAttribute("href",iconName);
    }
  }
  







  
}
