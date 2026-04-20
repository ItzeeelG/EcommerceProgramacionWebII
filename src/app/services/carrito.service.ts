//carrito.service.ts
import { Injectable, signal } from '@angular/core';
import { Product } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private productosSignal = signal<Product[]>([]);

  productos = this.productosSignal.asReadonly();

  agregar(producto: Product) {
    this.productosSignal.update(lista => [...lista, producto]);
  }

  quitar(id: number) {
    this.productosSignal.update(lista => lista.filter(p => p.id !== id));
  }

  vaciar() {
    this.productosSignal.set([]);
  }

  total(): number {
    return this.productosSignal().reduce((acc, p) => acc + p.price, 0);
  }

  exportarXML() {

    const productos = this.productosSignal();

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<recibo>\n`;

    for (const p of productos) {

      xml += `  <producto>\n`;
      xml += `    <id>${p.id}</id>\n`;
      xml += `    <nombre>${p.name}</nombre>\n`;
      xml += `    <precio>${p.price}</precio>\n`;
      xml += `    <categoria>${p.category}</categoria>\n`;
      xml += `    <descripcion>${p.description}</descripcion>\n`;
      xml += `  </producto>\n`;

    }

    xml += `  <total>${this.total()}</total>\n`;
    xml += `</recibo>`;

    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'recibo.xml';
    a.click();

    URL.revokeObjectURL(url);
  }

}