import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { Noticia } from './noticia';


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


  //Función para retornar los observables
  bdState(){
    return this.isDBReady.asObservable();
  }

  fetchNoticias(): Observable<Noticia[]>{
    return this.listaNoticia.asObservable();
  }

  buscarNoticia(){
    return this.dataBase.executeSql('SELECT * FROM NOTICIA', []).then((res) =>{
       //Variable para almacenar el resulado
       let items: Noticia[] = [];
       //Verificar la cantidad de registros
       if(res.rows.length > 0){
        //Agregar registro a registro en mi variable 
        for (let i = 0; i < res.rows.length; i++) {
          items.push({
            id: res.rows.item(i).id,
            titulo: res.rows.item(i).titulo,
            texto: res.rows.item(i).texto
          });
         }
       }
       //Actualizar el observable
       this.listaNoticia.next(items as any);
    })
  }

  insertarNoticia(titulo: any, texto: any){
    return this.dataBase.executeSql('INSERT INTO noticia(titulo,texto) VALUES(?, ?);', [titulo, texto]).then((res) =>{
        this.buscarNoticia();
    })
  }

  actualizarNoticia(id:any, titulo:any, texto:any){
    return this.dataBase.executeSql('UPDATE noticia SET titulo = ?, texto = ? WHERE ID = ?;', [titulo, texto, id]).then((res) =>{
      this.buscarNoticia();
    })
  }

  eliminarNoticia(id: any){
     return this.dataBase.executeSql('DELETE FROM noticia WHERE id = ?;', [id]).then((res) =>{
      this.buscarNoticia();
     })
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
      //Ejecutar la creación de tablas
      await this.dataBase.executeSql(this.tablaNoticia, []);

      //Ejecutar los insert
      await this.dataBase.executeSql(this.insert, []);

      //Cambiar observable
      this.isDBReady.next(true)
      this.buscarNoticia();


    }catch(err){
      this.presentAlert("Error en crearTabla: " + err);
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

