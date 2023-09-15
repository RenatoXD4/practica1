import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BdserviceService } from 'src/app/services/bdservice.service';

@Component({
  selector: 'app-modificar',
  templateUrl: './modificar.page.html',
  styleUrls: ['./modificar.page.scss'],
})
export class ModificarPage implements OnInit {
  idNoticia = "";
  tituloNoticia = "";
  textoNoticia = "";


  constructor(private router: Router, private activeRoute: ActivatedRoute, private bd: BdserviceService) {
    this.activeRoute.queryParamMap.subscribe(res =>{
      if(this.router.getCurrentNavigation()?.extras.state){
        this.idNoticia = this.router.getCurrentNavigation()?.extras?.state?.['idEnviado'];

        this.tituloNoticia = this.router.getCurrentNavigation()?.extras?.state?.['tituloEnviado'];

        this.textoNoticia = this.router.getCurrentNavigation()?.extras?.state?.['textoEnviado'];
      }
    })
  }

  
  editar(){
    this.bd.actualizarNoticia(this.idNoticia, this.tituloNoticia, this.textoNoticia);
    this.bd.presentAlert('Noticia Actualizada');
    this.router.navigate(['/listar']);

  }

  ngOnInit() {
  }
  

}
