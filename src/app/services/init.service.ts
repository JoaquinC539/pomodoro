import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InitService {
  private parentSubject=new BehaviorSubject<boolean>(false)
  parentInit$=this.parentSubject.asObservable();
  constructor() { }
  setParentInitialized(){
    this.parentSubject.next(true);
  }
}
