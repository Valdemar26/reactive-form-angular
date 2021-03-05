import { Component, OnDestroy, OnInit } from '@angular/core';

import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { forkJoin, Observable, Subscription } from 'rxjs';


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
}
