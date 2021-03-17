import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ErrorStateMatcher } from '@angular/material/core';

import { MatButtonModule } from '@angular/material/button';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormComponent } from './components/reactive-form/reactive-form.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { RequestInterceptor } from './interceptor/request.interceptor';

import { LoaderComponent } from './components/loader/loader-component/loader.component';
import { DatepickerComponent } from './components/datepicker/datepicker.component';

import { CustomErrorStateMatcher } from './class/custom-error-state-matcher';

@NgModule({
  declarations: [
    AppComponent,
    ReactiveFormComponent,
    MainPageComponent,
    LoaderComponent,
    DatepickerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
    MatDatepickerModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true },
    { provide: ErrorStateMatcher, useClass: CustomErrorStateMatcher }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
