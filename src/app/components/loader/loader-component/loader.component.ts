import {Component, Input, Renderer2, ViewChild, ViewContainerRef, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoaderComponent {

  @Input() priority: 'primary' | 'secondary' = 'primary';
  @Input() loaderType: 'blocking' | 'spinner' | 'slider' = 'blocking';

  @ViewChild('loader', {static: true, read: ViewContainerRef}) public loader: ViewContainerRef;

  public showLoader: boolean;

  constructor() {
  }

  public show(priority): void {

    if (this.priority !== priority) {
      return;
    }

    this.showLoader = true;
  }

  public hide(priority): void {

    if (this.priority !== priority) {
      return;
    }

    this.showLoader = false;
  }
}
