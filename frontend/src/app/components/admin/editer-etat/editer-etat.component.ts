import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { State } from 'src/app/models/state';
import { StatesService } from 'src/app/services/states.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-editer-etat',
  templateUrl: './editer-etat.component.html',
  styleUrls: ['./editer-etat.component.scss']
})
export class EditerEtatComponent implements OnInit {
  selectedFile: File = null;
  state: State;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<EditerEtatComponent>,
              private stateService: StatesService, private snackbar: MatSnackBar, private router: Router) {
    this.state = this.data.row;
  }


  OnEdit() {
   this.stateService.updateState(this.state).subscribe(
     () => {
      this.snackbar.open('State Updated Sucessfuly', 'Close', {
        duration: 2500,
        verticalPosition: 'top'
      });
      this.onClose();
      this.router.navigate(['/admin/home/listeetats']);
   });
  }

  onClose() {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}
