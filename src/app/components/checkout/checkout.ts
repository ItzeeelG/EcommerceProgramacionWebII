import {
  AfterViewInit, OnDestroy, Component,
  ElementRef, ViewChild, inject, computed,
} from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { PaypalService } from '../../services/paypal.service';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Product } from '../../models/producto.model';

declare const paypal: any;

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css'],
})
export class CheckoutComponent implements AfterViewInit {
  @ViewChild('paypalButtonContainer')
  paypalButtonContainer!: ElementRef<HTMLDivElement>;

  private carritoService = inject(CarritoService);
  private paypalService  = inject(PaypalService);

  carrito = this.carritoService.productos;
  total   = computed(() => this.carritoService.total());
  mensaje = '';

  ngAfterViewInit(): void {
    this.renderPaypalButton();
  }

  private renderPaypalButton(): void {
    if (this.carrito().length === 0) return;
    if (typeof paypal === 'undefined') {
      this.mensaje = 'No se cargó el SDK de PayPal.';
      return;
    }

    this.paypalButtonContainer.nativeElement.innerHTML = '';

    paypal.Buttons({
      createOrder: async () => {
        const items = this.carrito().map((p: Product) => ({
          nombre: p.name,
          cantidad: p.inStock,
          precio: p.price,
        }));
        const response = await firstValueFrom(
          this.paypalService.crearOrden({ items, total: this.total() })
        );
        return response.id;
      },

      onApprove: async (data: any) => {
        try {
          const productosSnapshot = [...this.carrito()];

          const capture = await firstValueFrom(
            this.paypalService.capturarOrden(data.orderID, productosSnapshot)
          );

          this.mensaje = 'Pago realizado correctamente.';

          // Descargam XML
          this.descargarXML(capture.xml);
          this.carritoService.vaciar();
          this.paypalButtonContainer.nativeElement.innerHTML = '';

        } catch (error) {
          console.error('Error al capturar el pago:', error);
          this.mensaje = 'Ocurrió un error al capturar el pago.';
        }
      },

      onCancel: () => { this.mensaje = 'Pago cancelado.'; },
      onError:  () => { this.mensaje = 'Error en PayPal.'; },

    }).render(this.paypalButtonContainer.nativeElement);
  }

  // Convierte el base64 a archivo y lo descarga
  private descargarXML(base64: string): void {
    const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    const blob  = new Blob([bytes], { type: 'application/octet-stream' });
    const url   = URL.createObjectURL(blob);

    const a      = document.createElement('a');
    a.href       = url;
    a.download   = 'recibo.xml';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}