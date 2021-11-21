import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  public app = null;
  constructor() { }
  getApp() {
    return this.app;
  }  
  
}