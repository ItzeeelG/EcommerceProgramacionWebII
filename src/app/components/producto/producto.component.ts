import { Component, Input } from "@angular/core"; // importar decoradores para poder usarlos en el código del núcleo de angular
//import { CurrencyPipe } from "@angular/common";
import { Product } from "../../models/producto.model";

@Component({
    selector: 'app-product-card', //nombre con el que se va a llamar 
    standalone: true, 
    //imports: [CurrencyPipe], //se usa para poder usar tipos de moneda
    templateUrl: './producto.component.html',
    styleUrls: ['./producto.component.css'],
})

export class ProductCardComponent{
    @Input({required:true}) product!:Product; //mandar informacion de otro lado
}