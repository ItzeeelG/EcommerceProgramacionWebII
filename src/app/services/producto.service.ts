//producto.service.ts
import { Injectable } from '@angular/core';

import { Product } from '../models/producto.model';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ProductoService {

  constructor(private http: HttpClient) {}

  getAll(): Observable<Product[]> {
    return this.http
      .get('/productos.xml', { responseType: 'text' }) 
      .pipe(map(xml => this.parseXml(xml)));
  }

  private parseXml(xmlText: string): Product[] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, 'application/xml');

    const products = Array.from(doc.getElementsByTagName('product'));

    return products.map(node => ({
      id: Number(this.getText(node, 'id')),
      name: this.getText(node, 'name'),
      price: Number(this.getText(node, 'price')),
      imagenUrl: this.getText(node, 'imageUrl'),
      category: this.getText(node, 'category'),
      description: this.getText(node, 'description'),
      inStock: Number(this.getText(node, 'inStock')) > 0
    }));
  }

  private getText(parent: Element, tag: string): string {
    return parent.getElementsByTagName(tag)[0]?.textContent ?? '';
  }

  /*
  private readonly products: Product[] = [
    {
      id: 1,
      name: 'Lapiz big',
      price: 5,
      imagenUrl: 'https://www.tuksonora.com/cdn/shop/products/Lapiz_Evolution_large.jpg?v=1719093213',
      category: 'Lapices',
      description: 'Lapis #2 marca big ',
      inStock: true,
    },
    {
      id: 2,
      name: 'Pluma azul big',
      price: 8,
      imagenUrl: 'https://www.cyberpuerta.mx/img/product/M/CP-BIC-7501014511016-1.jpg',
      category: 'Plumas',
      description: 'Pluma azul para rallar',
      inStock: true,
    },
    {
      id: 3,
      name: 'Cuaderno Norma raya',
      price: 30,
      imagenUrl: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSBycpZTZ-iNw196RS_QN6IFKeCvrs94FulzJwvdET4gmCZciWpJkd_Yje8mcUn687IjD_i2lqE7XkLaKBfCd8dvgZwBApQitbjWKrJCkqq6iTqYyOkpbCcpDkqfSHBgv0GcTk-aQ&usqp=CAc',
      category: 'Cuadernos',
      description: 'Cuaderno Norma para escribir en el we',
      inStock: false,
    },
  ];*/

  /*getAll(): Product[] {
    return this.products;
  }*/


}
