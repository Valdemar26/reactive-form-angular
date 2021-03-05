import { Injectable } from '@angular/core';
import { CanActivate, CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

export interface DirtyComponent {
  isDirty$: Observable<boolean>;
}

@Injectable({
  providedIn: 'root'
})
export class FormGuard implements CanActivate, CanDeactivate<DirtyComponent> {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }

  // https://metanit.com/web/angular2/7.7.php
  // https://netbasal.com/detect-unsaved-changes-in-angular-forms-75fd8f5f1fa6
  canDeactivate(
    component: DirtyComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    console.log(component);
    return component.isDirty$.pipe(
      switchMap((dirty: boolean) => {
        if (dirty === false) {
          return of(true);
        } else {
          return confirm('You have unsaved changes. Are you sure you want to leave this page?');
        }
      })
    );

  }

}
