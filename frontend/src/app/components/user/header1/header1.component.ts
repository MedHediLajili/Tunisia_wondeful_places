import { Component, OnInit } from '@angular/core';
import { Adherent } from 'src/app/models/adherent';
import { AdherentsService } from 'src/app/services/adherents.service';
import { TokensService } from 'src/app/services/tokens.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { element } from 'protractor';

@Component({
  selector: 'app-header1',
  templateUrl: './header1.component.html',
  styleUrls: ['./header1.component.scss']
})
export class Header1Component implements OnInit {
  adherent: Adherent ;


  constructor(private adherentService: AdherentsService, private snackbar: MatSnackBar,
              private tokenService: TokensService, private router: Router) {
                this.adherent = new Adherent();
              }

  ngOnInit() {
    if (this.tokenService.getToken()) {
      this.adherentService.adherentInfos(this.tokenService.getToken()).subscribe(
        (data) => {
        this.adherent = data ;
      });
    }
  }

  onLogout() {
    this.adherentService.logout(this.tokenService.getToken()).subscribe(
      (data) => {
      this.tokenService.deleteToken();
      this.router.navigateByUrl('/user/home').then(() => {
        window.location.reload();
      });
    });
  }

}
