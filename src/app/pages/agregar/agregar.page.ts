import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BdserviceService } from 'src/app/services/bdservice.service';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.page.html',
  styleUrls: ['./agregar.page.scss'],
})
export class AgregarPage implements OnInit {
  tituloNoticia = "";
  textoNoticia = "";

  constructor(public router:Router, private db: BdserviceService) { }

  ngOnInit() {
  }

  insertar(){
    this.db.insertarNoticia(this.tituloNoticia, this.textoNoticia);
    this.db.presentAlert('Noticia Agregada');
    this.router.navigate(['/listar']);
  }

  

}
