import { Component, OnInit } from '@angular/core';
import { Adherent } from 'src/app/models/adherent';
import { AdherentsService } from 'src/app/services/adherents.service';
import { ImagesService } from 'src/app/services/images.service';
import { TokensService } from 'src/app/services/tokens.service';
import { MatSnackBar, MatDialogConfig, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { VerifCodeComponent } from './verif-code/verif-code.component';

@Component({
  selector: 'app-userregister',
  templateUrl: './userregister.component.html',
  styleUrls: ['./userregister.component.scss']
})
export class UserregisterComponent implements OnInit {
  adherent: Adherent;
  adherentlogin: Adherent;
  selectedFile: File = null;
  constructor(private adherentService: AdherentsService , private imageService: ImagesService, private tokenService: TokensService ,
              private snackbar: MatSnackBar, private router: Router, public dialog: MatDialog) {
    this.adherent = new Adherent();
    this.adherentlogin = new Adherent();
  }

  ngOnInit() {
  }

  showImage(files: FileList) {
    const fd = new FormData();
    this.selectedFile = files.item(0);
    fd.append('photo',  this.selectedFile, this.selectedFile.name);
    this.adherent.photo = this.selectedFile.name;
    this.imageService.saveImage(fd).subscribe(
      () => {
        const im = document.getElementById('imag');
        im.setAttribute('src', 'http://127.0.0.1:8000/images/' + this.selectedFile.name);
        im.style.borderRadius = '50%';
        im.style.width = '50px';
        im.style.height = '50px';
    });
  }

  openDialogVerifyCode(): void {
    const codev = (Math.floor(Math.random() *100000) + 1).toString();
    this.adherentService.verifEmailAdherent(codev, this.adherent.firstname, this.adherent.lastname, this.adherent.email).subscribe();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.height = '50%';
    dialogConfig.data = {adherent: this.adherent, code: codev};
    this.dialog.open(VerifCodeComponent, dialogConfig).afterClosed().subscribe();
  }

  /*onRegister() {
    this.adherentService.register(this.adherent).subscribe(
      (data) => {
        console.log(data);
        if (data.success) {
          this.tokenService.setToken(data.token);
          this.router.navigateByUrl('/user/home').then(() => {
            window.location.reload();
          });
        } else {
          this.adherent.email = '';
          this.snackbar.open(data.error, 'Close', {
            duration: 5000,
            verticalPosition: 'top'
          });
        }
      });
  }*/
  onLogin(adherent: Adherent) {
    this.adherentService.login(this.adherentlogin).subscribe(
      (data) => {
        if (data.success) {
          this.tokenService.setToken(data.token);
          this.router.navigateByUrl('/user/home').then(() => {
            window.location.reload();
          });
          this.snackbar.open('Welcome', 'Close', {
            duration: 4000,
            verticalPosition: 'bottom'
          });
         } else {
          this.snackbar.open(data.message, 'Close', {
            duration: 4000,
            verticalPosition: 'bottom'
          });
         }
    });
  }
}
