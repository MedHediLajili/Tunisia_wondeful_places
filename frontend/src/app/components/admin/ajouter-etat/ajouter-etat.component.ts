import { Component, OnInit } from '@angular/core';
import { State } from 'src/app/models/state';
import { StatesService } from 'src/app/services/states.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ajouter-etat',
  templateUrl: './ajouter-etat.component.html',
  styleUrls: ['./ajouter-etat.component.scss']
})
export class AjouterEtatComponent implements OnInit {
  state: State;

  constructor(private stateService: StatesService, private snackbar: MatSnackBar , private router: Router) {
    this.state = new State();
  }

  AddState() {
  this.stateService.addState(this.state).subscribe(
  () => {
    this.snackbar.open('State Added Sucessfuly', 'Close', {
      duration: 2000,
      verticalPosition: 'top'
    });
    this.router.navigate(['/admin/home/listeetats']);
  });
  }


  ngOnInit() {
  }

}
