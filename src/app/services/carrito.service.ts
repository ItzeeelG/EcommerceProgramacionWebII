//carrito.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../models/producto.model';

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  private productosSignal = signal<Product[]>([]);

  productos = this.productosSignal.asReadonly();

  agregar(producto: Product) {
    this.productosSignal.update((lista) => [...lista, producto]);
  }

  quitar(id: number) {
    this.productosSignal.update((lista) => lista.filter((p) => p.id !== id));
  }

  vaciar() {
    this.productosSignal.set([]);
  }

  total(): number {
    return this.productosSignal().reduce((acc, p) => acc + p.price, 0);
  }

  exportarXML(productosParam?: Product[]) {

    const productos = productosParam ?? this.productosSignal();
    
    if (productos.length === 0) {
      console.warn('No hay productos para exportar');
      return;
    }

    const total = productos.reduce((acc, p) => acc + p.price, 0);

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<recibo>\n`;
    for (const p of productos) {
      xml += `  <producto>\n`;
      xml += `    <id>${p.id}</id>\n`;
      xml += `    <nombre>${p.name}</nombre>\n`;
      xml += `    <precio>${p.price}</precio>\n`;
      xml += `    <cantidad>${p.inStock}</cantidad>\n`;
      xml += `    <subtotal>${p.price * p.inStock}</subtotal>\n`;
      xml += `    <categoria>${p.category}</categoria>\n`;
      xml += `    <descripcion>${p.description}</descripcion>\n`;
      xml += `  </producto>\n`;
    }
    xml += `  <total>${total}</total>\n</recibo>`;

    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recibo.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
