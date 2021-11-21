import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { app } from 'firebase';
import { Item } from '../interfaces/Item';
import { HistoricPage } from '../pages/historic/historic.page';
import { DetailPage } from '../pages/home/detail/detail.page';
import { HomePage } from '../pages/home/home.page';
import { ListaPage } from '../pages/lista/lista.page';




@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(
    private storage: Storage,
  ) { }

  //metodo SET pegando a lista de app selecionados da lista.ts
  salvarLista(app, salvarItems: ListaPage) {
    try {
      return this.storage.set(app, salvarItems);
    } catch (error) {
      console.log('Está dando erro no Set ', error);
    }
  }

  //metodo Get guardando lista de app selecionados
  carregarLista(app) {
    return this.storage.get(app);
  }

  //metodo SET guardando a senha de bloqueio
  savePass(pass, senha: HomePage) {
    try {
      return this.storage.set(pass, senha);
    } catch (error) {
      console.log('Está dando erro no Set ', error);
    }
  }

  //metodo Get carregando a Senha de bloqueio
  loadPass(pass) {
    try {
      return this.storage.get(pass);
    } catch (error) {
      console.log('Está dando erro no Get ', error);
    }
  }

  saveKey(keyRec,forgot: HomePage) {
    try {
      return this.storage.set(keyRec, forgot);
    } catch (error) {
      console.log('Está dando erro no Set ', error);
    }
  }

  //metodo Get carregando a Senha de bloqueio
  loadKey(keyRec) {
    try {
      return this.storage.get(keyRec);
    } catch (error) {
      console.log('Está dando erro no Get ', error);
    }
  }

  resetApps(app){
    this.storage.remove(app);
    console.log('limpou?'); 
  }    

}