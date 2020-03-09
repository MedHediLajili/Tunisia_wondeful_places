import { Component, OnInit } from '@angular/core';
import { PlacesService } from 'src/app/services/places.service';
import { StatesService } from 'src/app/services/states.service';
import { ImagesService } from 'src/app/services/images.service';
import { PlaceCard } from 'src/app/models/place-card';
import { State } from 'src/app/models/state';
import { Place } from 'src/app/models/place';
import { ReactionsService } from 'src/app/services/reactions.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatDialogConfig, MatDialog } from '@angular/material';
import { AdherentsService } from 'src/app/services/adherents.service';
import { Adherent } from 'src/app/models/adherent';
import { Reaction } from 'src/app/models/reaction';
import { TokensService } from 'src/app/services/tokens.service';
import { CollectionsService } from 'src/app/services/collections.service';
import { Collection } from 'src/app/models/collection';
import { AjouterCollectionComponent } from '../collections/ajouter-collection/ajouter-collection.component';

@Component({
  selector: 'app-states-places',
  templateUrl: './states-places.component.html',
  styleUrls: ['./states-places.component.scss']
})
export class StatesPlacesComponent implements OnInit {
  states: State[] = [];
  adherent: Adherent ;
  placesCards: PlaceCard[] = [];
  collections: Collection[] ;
  constructor(private placeService: PlacesService, private stateService: StatesService, private imageService: ImagesService
            , private reactionService: ReactionsService, private adherentService: AdherentsService, private tokenService: TokensService ,
              private snackbar: MatSnackBar, private router: Router, private collectionService: CollectionsService,
              public dialog: MatDialog) {
      this.adherent = new Adherent();
    }

  verifAdherent() {
    if (!this.adherent) {
      this.snackbar.open('Connect First To React', 'Close', {
        duration: 5000,
        panelClass: ['blue-snackbar'],
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
      this.router.navigate(['/user/loginregister']);
    }
  }

  getCollections() {
    this.collectionService.getAdherentCollections(this.adherent.id).subscribe(
      (data) => {
        this.collections = data;
      });
  }

  addPlaceToCollection(collection: Collection, place: Place) {
    this.collectionService.addPlaceToCollection(collection.id, place.id).subscribe(
      (res) => {
        if (res.success === false) {
          this.snackbar.open(res.error, 'Close', {
            duration: 4000,
            panelClass: ['blue-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
        } else {
          this.snackbar.open('Place sucessfuly added to Collection', 'Close', {
            duration: 4000,
            panelClass: ['blue-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
        }
        this.getCollections();
      }
    );
  }

  onCreateCollection(placeid: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.height = '50%';
    dialogConfig.data = this.adherent;
    this.dialog.open(AjouterCollectionComponent, dialogConfig).afterClosed().subscribe(
      (data) => {
        this.collectionService.addPlaceToCollection(data.id, placeid).subscribe(
          (res) => {
            if (res.success === false) {
              this.snackbar.open(res.error, 'Close', {
                duration: 4000,
                panelClass: ['blue-snackbar'],
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
              });
            } else {
              this.snackbar.open('Place sucessfuly added to the new Collection', 'Close', {
                duration: 4000,
                panelClass: ['blue-snackbar'],
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
              });
            }
            this.getCollections();
          }
        );
      });
  }

  getAdherent() {
    const token = this.tokenService.getToken();
    if (token) {
      this.adherentService.adherentInfos(token).subscribe(
        (data) => {
          this.adherent = data;
          this.getCollections();
        }
      );
    } else {
      this.adherent = null;
    }
  }

  getAllStates() {
   this.stateService.getAllStates().subscribe(
     (data) => {
      this.states = data;
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0 ; i < this.states.length ; i++) {
        this.getAllPlacesOfState(this.states[i]);
      }
   });
  }
  getAllPlacesOfState(state: State) {
    this.stateService.getPlacesOfState(state.id).subscribe(
      (data) => {
        const places = data;
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0 ; i < places.length ; i++) {
          const placecard = new PlaceCard();
          placecard.images = [];
          placecard.indexes = [];
          placecard.state = state;
          placecard.reaction = new Reaction();
          placecard.place = places[i];
          this.imageService.getAllImagesOfPlace(placecard.place.id).subscribe(
            (images) => {
              placecard.images = images;
              for (let j = 0; j < placecard.images.length; j++) {
                placecard.indexes.push(j);
              }
              if (this.adherent) {
                this.reactionService.checkReactedTo(this.adherent.id, placecard.place.id).subscribe(
                (res) => {
                  placecard.reaction = res;
                  this.placesCards.push(placecard);
                });
              } else {
                this.placesCards.push(placecard);
              }
            }
            );
        }
    });
  }
  onFavoris(placecard: PlaceCard) {
    if (this.adherent) {
      if (placecard.reaction.is_favoris === undefined) {
        console.log('adding');
        placecard.reaction = new Reaction();
        placecard.reaction.is_favoris = 1;
        placecard.reaction.place_id = placecard.place.id;
        placecard.reaction.is_like = 0;
        this.reactionService.addReaction(placecard.reaction, this.adherent.id).subscribe(
          (data) => {
            placecard.reaction = data;
          }
        );

      } else  if (placecard.reaction.is_favoris === 1) {
        placecard.reaction.is_favoris = 0;
        this.reactionService.updateReaction(placecard.reaction).subscribe(
          (data) => {
            placecard.reaction = data;
            if (placecard.reaction.is_like === 0) {
              this.reactionService.deleteReaction(placecard.reaction).subscribe(
                () => {
                  placecard.reaction = new Reaction();
                  console.log(placecard.reaction.is_like);
                });
            }
          }
        );

        } else {

          placecard.reaction.is_favoris = 1;
          this.reactionService.updateReaction(placecard.reaction).subscribe(
            (data) => {
              placecard.reaction = data;
            }
          );
        }
    } else {
      this.snackbar.open('Connect First To React', 'Close', {
        duration: 5000,
        verticalPosition: 'top'
    });
      this.router.navigate(['/user/loginregister']);
  }
}

  onLike(placecard: PlaceCard) {
    if (this.adherent) {
      if (placecard.reaction.is_like === undefined) {
        console.log('adding');
        placecard.reaction = new Reaction();
        placecard.reaction.is_like = 1;
        placecard.reaction.place_id = placecard.place.id;
        placecard.reaction.is_favoris = 0;
        this.reactionService.addReaction(placecard.reaction, this.adherent.id).subscribe(
          (data) => {
            placecard.reaction = data;
          }
        );

      } else  if (placecard.reaction.is_like === 1) {
        placecard.reaction.is_like = 0;
        this.reactionService.updateReaction(placecard.reaction).subscribe(
          (data) => {
            placecard.reaction = data;
            if (placecard.reaction.is_favoris === 0) {
              this.reactionService.deleteReaction(placecard.reaction).subscribe(
                () => {
                  placecard.reaction = new Reaction();
                  console.log(placecard.reaction.is_like);
                }
              );
            }
          }
        );

        } else {

          placecard.reaction.is_like = 1;
          this.reactionService.updateReaction(placecard.reaction).subscribe(
            (data) => {
              placecard.reaction = data;
            }
          );
        }
    } else {
      this.snackbar.open('Connect First To React', 'Close', {
        duration: 5000,
        verticalPosition: 'top'
    });
      this.router.navigate(['/user/loginregister']);
  }
}

ngOnInit() {
  this.getAdherent();
  this.getAllStates();
}

}


