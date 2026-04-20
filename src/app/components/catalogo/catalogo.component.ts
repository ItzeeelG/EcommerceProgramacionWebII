//catalogo.component.ts
import { Component, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductCardComponent } from "../producto/producto.component";
import {ProductoService} from "../../services/producto.service";
import { Product } from "../../models/producto.model";
import { CarritoService } from '../../services/carrito.service';
import { CarritoComponent } from '../carrito/carrito.component';

@Component ({
    selector: 'app-catalogo',
    standalone: true,
    imports: [ProductCardComponent, CarritoComponent],
    templateUrl: './catalogo.component.html',
    styleUrls: ['./catalogo.component.css'],
    

})
export class CatalogoComponent{
  
    

  products: Product[] = []; //arreglo de productos
   constructor(
  private productService: ProductoService,
  private carritoService: CarritoService
) {
  this.productService.getAll().subscribe(data => {
    this.products = data;
  });
}
agregar(producto: Product){
  this.carritoService.agregar(producto);
}
    /*products: Product []= [];
    constructor (private productService: ProductoService){
        this.products=this.productService.getAll();
    }*/
}