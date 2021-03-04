import { Component, OnInit } from '@angular/core';

import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-reactive-form',
  templateUrl: './reactive-form.component.html',
  styleUrls: ['./reactive-form.component.scss']
})
export class ReactiveFormComponent implements OnInit {

  dynamicForm: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder) {

  }

  public ngOnInit(): void {
    this.initForm();
  }

  // convenience getters for easy access to form fields
  get f(): any { return this.dynamicForm.controls; }
  get t(): any { return this.f.tickets as FormArray; }

  public onSubmit(): void {
    this.submitted = true;

    console.log(this.dynamicForm.getRawValue());

    this.dynamicForm.reset();
  }

  public onReset(): void {
    // reset whole form back to initial state
    this.submitted = false;
    this.dynamicForm.reset();
    this.t.clear();
  }

  public onClear(): void {
    // clear errors and reset ticket fields
    this.submitted = false;
    this.t.reset();
  }

  public onChangeTickets(e): void {

    const numberOfTickets = e.value || 0;

    if (this.t.length < numberOfTickets) {
      for (let i = this.t.length; i < numberOfTickets; i++) {
        this.t.push(this.formBuilder.group({
          name: ['', Validators.required],
          email: ['', [Validators.required, Validators.email]]
        }));
      }
    } else {
      for (let i = this.t.length; i >= numberOfTickets; i--) {
        this.t.removeAt(i);
      }
    }
  }

  private initForm(): void {
    this.dynamicForm = this.formBuilder.group({
      numberOfTickets: ['', Validators.required],
      tickets: new FormArray([])
    });
  }
}
