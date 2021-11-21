import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { User } from 'src/app/interfaces/User';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {

  public user: User = {};
  private loading: any;
  private userId: string = null;
  private users = new Array<User>();
  private userSubscription: Subscription;
  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private userService: AuthService,
    private authService: AuthService,
    private navController: NavController,
    private activeRoute: ActivatedRoute,
  ) {
    this.userId = this.activeRoute.snapshot.params['id']; 

    if (this.userId) this.loadInfo();
    console.log('id?', this.userId);
    
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    if (this.userSubscription) this.userSubscription.unsubscribe();
  }


  async update() {

    await this.presentLoading();

    this.user.id = (await this.authService.getAuth().currentUser).uid;

    if (this.userId) {
      try {
        await this.userService.updateUser(this.userId, this.user);
        await this.loading.dismiss()
        console.log('ta indo alterar?')
        this.navController.navigateBack('/perfil');

        this.presentToast("Usuario alterado com sucesso")
      } catch (error) {
        this.presentToast('Erro ao tentar salvar');
        this.loading.dismiss();
      }
    }
  }
  async loadInfo() {
    this.userSubscription = (await this.userService.getUser(this.userId)).subscribe(data => {
      this.user = data;
    });
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
