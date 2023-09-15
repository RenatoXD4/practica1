import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { BdserviceService } from 'src/app/services/bdservice.service';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.page.html',
  styleUrls: ['./listar.page.scss'],
})
export class ListarPage implements OnInit {

  arregloNoticias: any = [
    {
      id: '',
      titulo: '',
      texto: ''
    }
  ]

  constructor(private bd: BdserviceService) { }


  modificar(x: any){

  }

  eliminar(x:any){
    this.bd.eliminarNoticia(x.id);
  }

  ngOnInit() {
    this.bd.bdState().subscribe(res => {
      //Verificar si el estatus es true
      if(res){
        this.bd.fetchNoticias().subscribe(datos =>{
           this.arregloNoticias = datos;
        })
      }
    })
    

  }

  
}
