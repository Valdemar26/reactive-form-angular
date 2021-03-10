import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { forkJoin, Observable, of, Subscription } from 'rxjs';


@Component({
  selector: 'app-reactive-form',
  templateUrl: './reactive-form.component.html',
  styleUrls: ['./reactive-form.component.scss']
})
export class ReactiveFormComponent implements OnInit, OnDestroy {

  dynamicForm: FormGroup;
  submitted = false;
  options: number[];
  numberOfTickets: number;

  serverData = {
    namesList: [],
    emailsList: []
  };

  unSaved = true;

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

    const numberOfTickets = e.value;
    this.numberOfTickets = numberOfTickets;

    if (this.tickets.length < numberOfTickets) {

      Array.from(Array(numberOfTickets).keys()).forEach(() => {
        this.tickets.push(this.formBuilder.group({
          name: ['', Validators.required],
          email: ['', [Validators.required, Validators.email]]
        }));
      });
    } else {

      const diff = this.tickets.length - numberOfTickets;

      this.tickets.controls.splice(this.tickets.length - diff, diff);
    }

    console.log('FORM: ', this.dynamicForm);
  }

  public fillData(): void {
    this.getDataFromServer();

    const numberOfTickets = 4;
    // TODO find angular dynamic form array
  }

  public getDataFromServer(): void {

    const namesAndEmailsSubscription = forkJoin([
      this.initNames(),
      this.initEmails()
    ]).subscribe(([names, emails]) => {

      const ticketsList = [
        {
          key: 'names',
          value: names.map((n) => n.name)
        },
        {
          key: 'emails',
          value: emails.map((e) => e.email)
        }
      ];

      console.log('ticketsList: ', ticketsList);

    });

    this.subscription.add(namesAndEmailsSubscription);
  }

  public canDeactivate(): Observable<boolean> | boolean {

    if (this.unSaved) {

      const result = window.confirm('You have unsaved changes. Are you sure you want to leave this page?');

      return of(result);
    }

    return true;
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private initForm(): void {
    this.dynamicForm = this.formBuilder.group({
      numberOfTickets: ['', Validators.required],
      tickets: new FormArray([])
    });
  }

  private initNames(): Observable<any> {
    return this.http.get(`https://random-data-api.com/api/name/random_name?size=${this.numberOfTickets}`);
  }

  private initEmails(): Observable<any> {
    return this.http.get(`https://random-data-api.com/api/users/random_user?size=${this.numberOfTickets}`);
  }

  private initOptions(): void {
    this.options = [1, 2, 3, 4, 5, 6, 7, 8];
  }

}
