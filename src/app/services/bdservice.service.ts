import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { AlertController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class BdserviceService {

  //variable de conexión a db
  public dataBase!: SQLiteObject;


  //variables para la creación de tablas
  tablaNoticia: string = "CREATE TABLE IF NOT EXISTS noticia(id INTEGER PRIMARY KEY autoincrement, titulo VARCHAR(100) NOT NULL, texto varchar(300) NOT NULL);"

  insert: string = "INSERT or IGNORE INTO noticia(id, titulo, texto) VALUES (1, 'Soy un titulo', 'Soy un texto de la noticia');"


  //observable de las tablas
  listaNoticia = new BehaviorSubject([]);


  //observable para la BD
  private isDBReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
  

  
  constructor(public sqlite: SQLite, private platform: Platform, private alertController: AlertController) { 
    this.crearBD();
  }

  crearBD(){
    //Verificar es el platform
    this.platform.ready().then(()=>{
      //Crear la bd
      this.sqlite.create({
        name: 'bdNoticias.db',
        location: 'default', 
      }).then((db: SQLiteObject) =>{
        //capturar la conexión de la BD
        this.dataBase = db;

        //ejecución creación de tablas;
        this.crearTablas();
      }).catch((err) =>{
        this.presentAlert("Error en la creación de la base de datos: " + err);
      })
    }) 
  }

  async crearTablas(){
    try{
      //Ejecutar la ejecución de tablas
      await this.dataBase.executeSql(this.tablaNoticia, []);

      //Ejecutar los insert
      await this.dataBase.executeSql(this.insert, []);

      //Cambiar observable

      this.isDBReady.next(true)


    }catch(err){
      this.presentAlert("Error en la creación de la base de datos: " + err);
    }

  }

  async presentAlert(msj: string) {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'Important message',
      message: 'This is an alert!',
      buttons: ['OK'],
    });

    await alert.present();
  }

  
}

