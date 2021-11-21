import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from './../../interfaces/User';
import { __assign } from 'tslib';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  public tipo: boolean;
  profile = {} as User;

  public user: User = {};
  private loading: any;
  private info: User = {};
  private InfoId: string = null;
  private infoSubscription: Subscription;
  private users = new Array<User>();
  private usersSubscription: Subscription;
  constructor(
    private afa: AngularFireAuth,
    private afs: AngularFirestore,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private productService: AuthService,
    private authService: AuthService,
    private navController: NavController,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
  }

  exibirOcultar() {
    this.tipo = !this.tipo;
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({ message: 'Aguarde...' });
    return this.loading.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000 });
    toast.present();
  }

  async register() {
    await this.presentLoading();
    try {
      const newUser = await this.afa.createUserWithEmailAndPassword(this.user.email, this.user.password);
      const newUserObject = Object.assign({}, this.user);

      delete newUserObject.password;

      await this.afs.collection('Users').doc(newUser.user.uid).set(newUserObject);
      this.presentToast("Cadastrado com sucesso");
    } catch (error) {
      this.presentToast(error.message);
    } finally {
      this.loading.dismiss();
      this.router.navigate(['/login'])
    }
  }

}
