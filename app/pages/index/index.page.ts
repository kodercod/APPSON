import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertController, ToastController } from '@ionic/angular';
import { Item } from 'src/app/interfaces/Item';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
})
export class IndexPage implements OnInit {

  private items: Array<Item>
  private newItem: any;
  constructor(
    private authService: AuthService,
    private alertController: AlertController,
    private storageService: StorageService,
    private toastCtrl: ToastController,
  ) { }

  async ngOnInit() {
   
  }


 async logout() {
    try {
      await this.authService.logout();
    } catch (error) {
      console.error(error);
    }
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
            this.logout();
          }
        }
      ]
    });

    await alert.present();
  }

  
  async create(){
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Criar novo Filho',
      inputs: [
        {
          name: 'nome',
          type: 'text',
          placeholder: 'Nome do filho',
          cssClass: 'my-custom-class',
          attributes: {
            maxlength: 50,
          }
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            
          }
        }, {
          text: 'Criar',
          handler: async data => {
              this.newItem= data.nome;
              console.log(this.newItem)
          }
        }
      ]
    });
    await alert.present();
      
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000 });
    toast.present();
  }



}
