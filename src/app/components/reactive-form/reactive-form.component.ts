import { Component, OnDestroy, OnInit } from '@angular/core';

import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import {forkJoin, Observable, of, Subscription} from 'rxjs';

import { ComponentCanDeactivate } from '../../guards/form.guard';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-reactive-form',
  templateUrl: './reactive-form.component.html',
  styleUrls: ['./reactive-form.component.scss']
})
export class ReactiveFormComponent implements OnInit, OnDestroy {

  dynamicForm: FormGroup;
  submitted = false;
  options: number[];

  obj = {
    namesList: [],
    emailsList: []
  };

  private subscription: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient
    ) {}

  public ngOnInit(): void {
    this.initForm();
    this.initOptions();
  }

  // getters for easy access to form fields
  get controls(): any { return this.dynamicForm.controls; }
  get tickets(): any { return this.controls.tickets as FormArray; }

  public onSubmit(): void {
    this.submitted = true;

    console.log(this.dynamicForm.getRawValue());

    this.dynamicForm.reset();
    // TODO remove dynamic fields
  }

  public onReset(): void {
    // reset whole form back to initial state
    this.submitted = false;
    this.dynamicForm.reset();
    this.tickets.clear();
  }

  public onChangeTickets(e): void {

    const numberOfTickets = e.value || 0;

    if (this.tickets.length < numberOfTickets) {
      for (let i = this.tickets.length; i < numberOfTickets; i++) {
        this.tickets.push(this.formBuilder.group({
          name: ['', Validators.required],
          email: ['', [Validators.required, Validators.email]]
        }));
      }
    } else {
      for (let i = this.tickets.length; i >= numberOfTickets; i--) {
        this.tickets.removeAt(i);
      }
    }
  }

  public fillData(): void {
    this.getDataFromServer();

    const numberOfTickets = 4;

    // TODO rewrite dirty code below
    setTimeout(() => {
      for (let i = this.tickets.length; i < numberOfTickets; i++) {
        for (const name of this.obj.namesList) {
          this.tickets.push(this.formBuilder.group({
            name: [name, Validators.required],
            email: ['', [Validators.required, Validators.email]]
          }));
        }
      }
    }, 500);


  }

  private initForm(): void {
    this.dynamicForm = this.formBuilder.group({
      numberOfTickets: ['', Validators.required],
      tickets: new FormArray([])
    });
  }

  public getDataFromServer(): void {

    const namesAndEmailsSubscription = forkJoin([
      this.initNames(),
      this.initEmails()
    ]).subscribe(([names, emails]) => {
      console.log('namesAndEmailsSubscription: ', names, emails);

      names = names.map((n) => n.name);
      emails = emails.map((e) => e.email);

      if (names && emails) {
        this.obj = {
          namesList: names,
          emailsList: emails
        };
      }

      console.log('OBJECT: ', this.obj);
    });

    setTimeout(() => this.dynamicForm.patchValue({numberOfTickets: 4}), 0);
    // onChangeTickets method -> set names and emails

    // setTimeout(() => {
    //   for (const name of this.obj.namesList) {
    //     console.log(name);
    //     this.controls.tickets.push(new FormControl(name, Validators.required));
    //   }
    // }, 1500);


    this.subscription.add(namesAndEmailsSubscription);
  }

  private initNames(): Observable<any> {
    return this.http.get('https://random-data-api.com/api/name/random_name?size=4');
  }

  private initEmails(): Observable<any> {
    return this.http.get('https://random-data-api.com/api/users/random_user?size=4');
  }

  private initOptions(): void {
    this.options = [1, 2, 3, 4];
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // canDeactivate(component: DirtyComponent): boolean | Observable<boolean> {

    // https://netbasal.com/detect-unsaved-changes-in-angular-forms-75fd8f5f1fa6

    // return component.isDirty$.pipe(
    //   switchMap((dirty: boolean) => {
    //     if (dirty === false) {
    //       return of(true);
    //     }
    //   })
    // );
    // if (!this.saved){
    //   return confirm('You have unsaved changes. Are you sure you want to leave this page?');
    // }
    // else{
    //   return true;
    // }
  // }
}
