import { Injectable } from '@angular/core';
import { Timer } from '../interfaces/Timer';
import Dexie, { Table } from 'dexie';
import { MetaData } from '../interfaces/MetdaData';



@Injectable({
  providedIn: 'root'
})
export class DbService extends Dexie {
  timers!: Table<Timer, number>;
  metadate!: Table<MetaData, number>;



  constructor() {
    super("pomodoroSettings")
    this.version(3).stores({
      timers: "++id,name",
      metadate: "++id"
    });
  }

  async setDate(date: string, pomoCounter: number) {
    const meta = await this.metadate.get(1);
    if (meta) {
      meta.date = date;
      meta.pomoCounter = pomoCounter;
      await this.metadate.put(meta);
    } else {
      await this.metadate.add({ date, pomoCounter });
    }
  }

  async getDate(): Promise<MetaData | undefined> {
    return await this.metadate.get(1);
  }
  async updateCounterPlusOne(): Promise<MetaData | null | undefined> {
    const meta = await this.metadate.get(1);
    if (meta) {
      meta.pomoCounter++;
      const metaUpdate = await this.metadate.put(meta)
      return await this.metadate.get(1);
    } else {
      return null;
    }
  }

  async getTimers(): Promise<Array<Timer>> {
    return await this.timers.toArray();
  }
  async getTimer(id: number): Promise<Timer | undefined> {
    return await this.timers.get(id);
  }
  async addTimer(timer:Timer): Promise<void> {
    await this.timers.add(timer)
  }

  public getFormattedDate(currentDate: Date): string {
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    const formattedDate = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;

    return formattedDate
  }

}
