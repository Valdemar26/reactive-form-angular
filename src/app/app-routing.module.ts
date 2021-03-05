import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReactiveFormComponent } from './components/reactive-form/reactive-form.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { FormGuard } from './guards/form.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'main' },
  { path: 'main', component: MainPageComponent },
  { path: 'reactive-form', component: ReactiveFormComponent, canDeactivate: [FormGuard] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
