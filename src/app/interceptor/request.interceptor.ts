import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (request) {

      const authReq = request.clone({
        headers: new HttpHeaders({
          'Content-Type':  'application/json'
        })
      });

      return next.handle(authReq).pipe(
        tap(
          () => {},
        (error: Error) => {throwError(error); }
        ));
    }
  }
}
