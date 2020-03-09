import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material';

@Component({
  selector: 'app-termsofuse',
  templateUrl: './termsofuse.html',
  styleUrls: ['./termsofuse.scss']
})
export class TermsOfUseComponent {

  constructor(public dialogRef: MatDialogRef<TermsOfUseComponent>) {

  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'app-dataprotection',
  templateUrl: './dataprotection.html',
  styleUrls: ['./dataprotection.scss']
})
export class DataProtectionComponent {

  constructor(public dialogRef: MatDialogRef<DataProtectionComponent>) {

  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.html',
  styleUrls: ['./privacy.scss']
})
export class PrivacyComponent {

  constructor(public dialogRef: MatDialogRef<PrivacyComponent>) {

  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  openDialogTermsOfUse(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '90%';
    dialogConfig.height = '90%';
    this.dialog.open(TermsOfUseComponent, dialogConfig);
  }

  openDialogDataProtection(): void{
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '90%';
    dialogConfig.height = '90%';
    this.dialog.open(DataProtectionComponent, dialogConfig);
  }

  openDialogPrivacy(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '90%';
    dialogConfig.height = '90%';
    this.dialog.open(PrivacyComponent, dialogConfig);
  }


  ngOnInit() {
  }

}
