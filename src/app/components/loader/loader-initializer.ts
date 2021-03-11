import {Component, QueryList, ViewChildren} from '@angular/core';

import { LoaderComponent } from './loader-component/loader.component';

@Component({
  template: ''
})

export abstract class LoaderInitializerComponent {

  @ViewChildren(LoaderComponent, { read: LoaderComponent }) loaders: QueryList<LoaderComponent>;

  public isLoading: boolean;

  public showLoader(): void {
    this.show('primary');
  }

  public hideLoader(): void {
    this.hide('primary');
  }

  private show(priority): void {

    setTimeout(() => {
      this.loaders.forEach((loader: LoaderComponent) => {
        loader.show(priority);
      });

      this.setIsLoading();
    });
  }

  private hide(priority): void {

    setTimeout(() => {
      this.loaders.forEach((loader: LoaderComponent) => {
        loader.hide(priority);
      });

      this.setIsLoading();
    });
  }

  private setIsLoading(): void {
    this.isLoading = this.loaders.some((loader: LoaderComponent) => loader.showLoader);
  }
}
