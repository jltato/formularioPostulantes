import { Routes } from '@angular/router';
import { ConfirmacionComponent } from '../app/pages/confirmacion/confirmacion.component';
import { FormularioComponent } from './formulario/formulario.component';

export const routes: Routes = [
  { path: 'confirmacion', component: ConfirmacionComponent },
  { path: '', redirectTo: 'cadete', pathMatch: 'full' },
  { path: ':id', component: FormularioComponent }

];
