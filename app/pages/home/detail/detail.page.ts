import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { StorageService } from 'src/app/services/storage.service';

import { UtilsService } from '../../../services/utils.service';


@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  public package: any;
  public unityVersion = "Loading...";
  public appSize = "Loading...";
  public technology = null;
  public history: any = [
    {appName: ''}
  ];

  constructor(
    public aRoute: ActivatedRoute,
    public router: Router,
    public utilsService: UtilsService,
    public ngZone: NgZone,
    private storageService: StorageService,
  ) {

  }

  ngOnInit() {
    this.package = this.aRoute.snapshot.paramMap.get("id");
    if (!this.package || !this.utilsService.app) {
      this.router.navigate(['/home']);
      return false;
    }
  }

  openApp(pkg) {
    console.log(pkg);

    if (window['DeviceApps'])
      window['DeviceApps'].openApp(() => {
        console.log('Success');
      }, () => {
        console.log('Error');
      }, pkg);
    }
}
