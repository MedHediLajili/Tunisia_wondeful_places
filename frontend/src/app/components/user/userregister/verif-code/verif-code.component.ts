import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { AdherentsService } from 'src/app/services/adherents.service';
import { TokensService } from 'src/app/services/tokens.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verif-code',
  templateUrl: './verif-code.component.html',
  styleUrls: ['./verif-code.component.scss']
})
export class VerifCodeComponent implements OnInit {

  code: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any , public dialogRef: MatDialogRef<VerifCodeComponent>,
              private adherentService: AdherentsService, private tokenService: TokensService ,
              private snackbar: MatSnackBar, private router: Router) { }

  onConfirm() {
  if (this.code === this.data.code) {
    this.adherentService.register(this.data.adherent).subscribe(
      (res) => {

        if (res.success) {
          this.tokenService.setToken(res.token);
          this.router.navigateByUrl('/user/home').then(() => {
            window.location.reload();
          });
        } else {
          this.data.email = '';
          this.snackbar.open(res.error, 'Close', {
            duration: 5000,
            verticalPosition: 'top'
          });
        }
      });
  } else {
    this.snackbar.open('Code incorrect !', 'Close', {
      duration: 6000,
      verticalPosition: 'top'
    });
  }
  }
  onClose() {
    this.dialogRef.close();
  }
  ngOnInit() {
  }

}
