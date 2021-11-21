import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    // console.log(this.androidPermissions.PERMISSION);
    // this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION]);
    // let status bar overlay webview
    this.statusBar.overlaysWebView(false);

    // set status bar to white
    // this.statusBar.backgroundColorByHexString('#ffffff');
    this.initializeApp();

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // this.statusBar.styleDefault();
      if (window['cordova'] && window['cordova']['plugins'] && window['cordova']['plugins']['permissions']) {
        window['cordova']['plugins']['permissions'].requestPermission(window['cordova']['plugins']['permissions'].DUMP,
          () => {
            console.log('permission DUMP success');
          }, (err) => {
            console.log('permission DUMP error', err);
          })
      }
      this.splashScreen.hide();
    });
  }
}
