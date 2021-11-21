import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import * as firebase from 'firebase';
import { of, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from 'src/app/interfaces/User';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  private info: User = {};
  private loading: any;
  private InfoId: string = null;
  private infoSubscription: Subscription;
  public users = new Array<User>();
  private userSubscription: Subscription;
  public user: any = {};
  private userId: string = null;
  constructor(
    private afa: AngularFireAuth,
    private afs: AngularFirestore,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private userService: AuthService,
    private authService: AuthService,
    private storageService: StorageService,
    private activeRoute: ActivatedRoute,
    private alertController: AlertController
  ) {
    this.userSubscription = this.userService.getUsers().subscribe(data => {
      this.users = data;
    });
    this.userId = this.activeRoute.snapshot.params['id']; 

   }

  async ngOnInit() {
    this.loadInfo();
    this.userId = this.activeRoute.snapshot.params['id']; 
    if (this.userId) this.update();
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  //lgout do app
  async logout() {
    try {
      await this.authService.logout();
      this.storageService.resetApps('tarefas');
    } catch (error) {
      console.error(error);
    }
  }

  async Alert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Sair',
      message: 'Deseja realmente sair da sua Conta?',
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Cancelou');
          }
        }, {
          text: 'Sim',
          handler: () => {
            console.log('Confirm Okay');
            this.logout();
          }
        }
      ]
    });

    await alert.present();
  }


  async presentLoading() {
    this.loading = await this.loadingCtrl.create({ message: 'Aguarde...' });
    return this.loading.present();
  }

  async loadInfo() {
    this.userSubscription = (await this.userService.getUser(this.userId)).subscribe(data => {
      this.user = data;
      console.log(this.user)
    });
  }

  async update(){
    this.user.id = (await this.authService.getAuth().currentUser).uid;
    if(this.userId){
    await this.userService.updateUser(this.userId, this.user).then
  }
  }
}
