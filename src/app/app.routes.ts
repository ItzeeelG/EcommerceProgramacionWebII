import { Routes } from '@angular/router';
import { CatalogoComponent } from './components/catalogo/catalogo.component';
import { CheckoutComponent } from './components/checkout/checkout';

export const routes: Routes = [
    {path:'',component: CatalogoComponent},
    { path: 'checkout', component: CheckoutComponent },
    {path: '**', redirectTo:''}
];
