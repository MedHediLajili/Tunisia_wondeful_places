import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PlaceCard } from 'src/app/models/place-card';
import { Adherent } from 'src/app/models/adherent';
import { PlacesService } from 'src/app/services/places.service';
import { AdherentsService } from 'src/app/services/adherents.service';
import { StatesService } from 'src/app/services/states.service';
import { ImagesService } from 'src/app/services/images.service';
import { TokensService } from 'src/app/services/tokens.service';
import { MatSnackBar, MatDialogConfig, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { ReactionsService } from 'src/app/services/reactions.service';
import { Place } from 'src/app/models/place';
import { State } from 'src/app/models/state';
import { Reaction } from 'src/app/models/reaction';
import { AjouterCollectionComponent } from '../collections/ajouter-collection/ajouter-collection.component';
import { CollectionsService } from 'src/app/services/collections.service';
import { Collection } from 'src/app/models/collection';

@Component({
  selector: 'app-reactions',
  templateUrl: './reactions.component.html',
  styleUrls: ['./reactions.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReactionsComponent implements OnInit {
  favoredplacescards: PlaceCard[] = [];
  likedplacescards: PlaceCard[] = [];
  states: State[];
  places: Place[];
  adherent: Adherent;
  collections: Collection[];
  constructor(private placeService: PlacesService, private stateService: StatesService, private imageService: ImagesService,
              private reactionService: ReactionsService, private adherentService: AdherentsService, private tokenService: TokensService ,
              private snackbar: MatSnackBar, private router: Router, private collectionService: CollectionsService,
              public dialog: MatDialog) {
      this.adherent = new Adherent();
}

  getAdherent() {
    const token = this.tokenService.getToken();
    this.adherentService.adherentInfos(token).subscribe(
      (data) => {
        this.adherent = data;
        this.getCollections();
      }
    );
  }
  getAllPlaces() {
    this.placeService.getAllPlaces().subscribe(
      (data) => {
        this.places = data;
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.places.length; i++) {
          this.loadPlaceCard(this.places[i]);
        }
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

  getCollections() {
    this.collectionService.getAdherentCollections(this.adherent.id).subscribe(
      (data) => {
        this.collections = data;
      });
  }

  loadPlaceCard(place: Place) {
    const placecard = new PlaceCard();
    placecard.place = new Place();
    placecard.images = [];
    placecard.indexes = [];
    placecard.state = new State();
    placecard.reaction = new Reaction();
    placecard.place = place;
    this.stateService.getState(place.state_id).subscribe(
      (state) => {
        placecard.state = state;
        this.reactionService.checkReactedTo(this.adherent.id, placecard.place.id).subscribe(
          (data) => {
            placecard.reaction = data;
            if (data) {
              this.imageService.getAllImagesOfPlace(place.id).subscribe(
                (images) => {
                  placecard.images = images;
                  for (let j = 0; j < placecard.images.length; j++) {
                    placecard.indexes.push(j);
                  }
                  if (data.is_like === 1) {this.likedplacescards.push(placecard); }
                  if (data.is_favoris === 1) {this.favoredplacescards.push(placecard); }
                });
            }
          }

      );
      }
      );
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
        this.favoredplacescards.splice( this.favoredplacescards.indexOf(placecard), 1 );
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
          this.favoredplacescards.push(placecard);
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
        this.likedplacescards.splice( this.likedplacescards.indexOf(placecard), 1 );
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
          this.likedplacescards.push(placecard);
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
    this.getAllPlaces();
  }

}
