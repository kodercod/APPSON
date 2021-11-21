import { Component, OnInit, ViewChild } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonList, IonSlides, LoadingController, ModalController, NavController, Platform, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs';
import { StorageService } from 'src/app/services/storage.service';
import { ListaPage } from '../lista/lista.page';
import { User } from 'src/app/interfaces/User';
import { Item } from 'src/app/interfaces/Item';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
const { App } = Plugins;

declare var cordova: any;
declare var window: any;



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  public options: Array<any> = [
    {icon: 'person-outline', text: 'Perfil', click:'perfil()'},
    {icon: 'help-outline', text: 'Ajuda'},
    {icon: 'exit-outline', text: 'Sair', click:'logout()'}
  ];
  public slideOptions:  any = {freeMode: true};
  @ViewChild(IonSlides) slides: IonSlides;
  public wavesPosition: number = 0;
  private wavesDifference: number = 100;
  public user: any = {};
  public historys: any;
  private userId: string = null;
  public items: Array<Item>;
  public itens: any;
  public package: any;
  public loading: any;
  public applist: any = [];
  public tipo: boolean;
  private pass: any;
  private forgot: any;
  private usersSubscription: Subscription;
  public users = new Array<User>();
  public checked: any = [];
  public tasks: any = [];
  public apps: any = [];
  public userDoc: any = [];
  private userSubscription: Subscription;
  private UsersCollection: AngularFirestoreCollection<User>;
  constructor(
    public router: Router,
    public navCtrl: NavController,
    public utilsService: UtilsService,
    public aRoute: ActivatedRoute,
    private authService: AuthService,
    private storage: Storage,
    public platform: Platform,
    public modalController: ModalController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private storageService: StorageService,
    private usersService: AuthService,
    private alertController: AlertController,
    private userService: AuthService,
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    
  ) {
    this.storageService.carregarLista('tarefas').then((tarefas) => {
      if (tarefas) {
        this.apps = tarefas;
      }
    });
      
    if (this.userId) this.loadInfo();
  }
  async ngOnInit() {
  }

  segmentChanged(event: any) {
    if (event.detail.value === 'apps') {
      this.slides.slidePrev();
      this.wavesPosition += this.wavesDifference;
    } else {
      this.slides.slideNext();
      this.wavesPosition -= this.wavesDifference;
    }
  }


  async loadInfo() {
    this.userSubscription = (await this.userService.getUser(this.userId)).subscribe(data => {
      this.user = data;
      console.log(this.user)
    });
  }
  
  //abre a modal mostrando os apps
  async abrirModal() {
    const modal = await this.modalController.create({
      component: ListaPage,
    });
    await modal.present();
    await modal.onDidDismiss();
    this.storageService.carregarLista('tarefas').then((app) => {
      this.apps = app
      console.log('funfa?', this.apps)
    });
  }

  //Encerrar a aplicação
  exitApp(){
    App.exitApp();
    console.log('Saindo da aplicação');
    
  }

 

  //envia para a pagina de  detalhes sobre os apps
  goDetail(app = null) {
    if (!app) return;
    this.utilsService.app = app;
    this.router.navigate(['detail/' + app['packageName']], { relativeTo: this.aRoute });
  }
  removeItem(app) {
    this.apps.splice(this.apps.indexOf(app), 1);
    this.storage.set('tarefas', this.apps).then((val) => {
      console.log(val)
      this.presentToast('Aplicativo removido com sucesso')
    });
  }

  lockUnlock() {

    if (this.tipo = !this.tipo) {
      this.inputBloquear();
    } else {
      this.inputDesbloquear().then(() => {
      });
    }
  }

  async inputBloquear() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Por favor insira sua senha!',
      inputs: [
        {
          name: 'senha',
          type: 'password',
          placeholder: 'Senha para bloqueio',
          cssClass: 'my-custom-class',
          attributes: {
            maxlength: 20,
          }
        },
        {
          name: 'forgot',
          type: 'text',
          placeholder: 'Chave de recuperação de senha',
          cssClass: 'my-custom-class',
          attributes: {
            maxlength: 200,
          }
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.tipo = false;
          }
        }, {
          text: 'Bloquear',
          handler: data => {
            this.pass = data.senha;
            this.forgot = data.forgot;

            this.storageService.savePass('senha', this.pass).then(() => {
              console.log('senha', this.pass);
              this.presentToast("Bloqueado com sucesso");
            });
            this.storageService.saveKey('recuperacao', this.forgot).then(() => {
              console.log('chave', this.forgot);
            });

          }
        }
      ]
    });

    await alert.present();
  }

  async inputDesbloquear() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Por favor insira sua senha!',
      inputs: [
        {
          name: 'senha',
          type: 'password',
          placeholder: 'Senha para desbloqueio',
          cssClass: 'my-custom-class',
          attributes: {
            maxlength: 20,
          }
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.tipo = true;
          }
        },
        {
          text: 'Desbloquear',
          handler: data => {
            this.pass = data.senha;

            this.storageService.loadPass('senha').then((val) => {
              if (this.pass == val) {
                this.presentToast("Desbloqueado com sucesso");
              } else {
                this.inputDesbloquear();
                this.presentToast("Senha incorreta, tente novamente")
              }
            })
          }

        },
        {
          text: 'Esqueci a senha',
          role: 'forgot',
          cssClass: 'secondary',
          handler: () => {
            this.forgotPass();
          }
        },
      ]
    });

    await alert.present();
  }
  async forgotPass() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Por favor insira sua senha!',
      inputs: [
        {
          name: 'request',
          type: 'text',
          placeholder: 'Chave de recuperação',
          cssClass: 'my-custom-class',
          attributes: {
            maxlength: 20,
          }
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.tipo = true;
          }
        }, {
          text: 'Recuperar',
          handler: data => {
            this.forgot = data.request
            this.storageService.loadKey('recuperacao').then((rec) => {
              if (this.forgot == rec) {
                console.log("Funcionou");
                this.presentToast('Chave correta, insira uma nova senha')
              } else {
                
                this.presentToast('Chave incorreta, tente novamente')
                this.forgotPass();
              }
            })
          }
        }
      ]
    });

    await alert.present();
  }

  async Alert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Sair',
      message: 'Deseja realmente sair do aplicativo?',
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
            this.exitApp();
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

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000 });
    toast.present();
  }

}

