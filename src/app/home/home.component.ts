import { Component, Inject, Injectable } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { RegisterComponent } from '../register/register.component';
import { Router } from '@angular/router';
import { RestApiService } from '../service/rest-api.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  constructor(private dialog: MatDialog, private router: Router) {}

  public EditProfile(): void {
    this.openDialog();

  }
  AddProfile(){
    this.openDialog()
  }

  public openDialog(): void {
    var _popup = this.dialog.open(RegisterComponent, {
      width: '50%',
      enterAnimationDuration: '1000ms',
      exitAnimationDuration: '1000ms',
    });
    _popup.afterClosed().subscribe((item) => {
      console.log(item);
    });
  }
}
