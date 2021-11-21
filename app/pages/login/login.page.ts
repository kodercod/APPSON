import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, LoadingController, ToastController } from '@ionic/angular';
import { User } from 'src/app/interfaces/User';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild(IonSlides) slides: IonSlides;
  public tipo: boolean;
  public wavesPosition: number = 0;
  private wavesDifference: number = 100;
  public userLogin: User = {};
  public userRegister: User = {};
  private loading: any;
  constructor(
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
  ) { }

  ngOnInit() {
  }
  
  exibirOcultar() {
    this.tipo = !this.tipo;
  }

  segmentChanged(event: any) {
    if (event.detail.value === 'login') {
      this.slides.slidePrev();
      this.wavesPosition += this.wavesDifference;
    } else {
      this.slides.slideNext();
      this.wavesPosition -= this.wavesDifference;
    }
  }

  async login() {
    await this.presentLoading();

    try {
      await this.authService.login(this.userLogin);
    } catch (error) {
      this.presentToast(error.message);
    } finally {
      this.loading.dismiss();
    }
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({ message: 'Aguarde...' });
    return this.loading.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000 });
    toast.present();
  }


}
