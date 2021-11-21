import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Item } from 'src/app/interfaces/Item';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-historic',
  templateUrl: './historic.page.html',
  styleUrls: ['./historic.page.scss'],
})
export class HistoricPage implements OnInit {
  public list: any;
  public myDate: Date;
  private items: any;
  constructor(
    public storageService: StorageService,
    public storage: Storage,
    public toastCtrl: ToastController
  ) { }

  async ngOnInit() {
  
  }

}
