import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PlacesService } from 'src/app/services/places.service';
import { Place } from 'src/app/models/place';
import { StatesService } from 'src/app/services/states.service';
import { State } from 'src/app/models/state';
import { ImagesService } from 'src/app/services/images.service';
import { PlaceCard } from 'src/app/models/place-card';
import { ReactionsService } from 'src/app/services/reactions.service';
import { TokensService } from 'src/app/services/tokens.service';
import { MatSnackBar, MatDialog, MatDialogConfig } from '@angular/material';
import { AdherentsService } from 'src/app/services/adherents.service';
import { Adherent } from 'src/app/models/adherent';
import { Reaction } from 'src/app/models/reaction';
import { Router } from '@angular/router';
import { CollectionsService } from 'src/app/services/collections.service';
import { Collection } from 'src/app/models/collection';
import { AjouterCollectionComponent } from '../collections/ajouter-collection/ajouter-collection.component';

@Component({
  selector: 'app-allplaces',
  templateUrl: './allplaces.component.html',
  styleUrls: ['./allplaces.component.scss'],
})
export class AllplacesComponent implements OnInit {
  states: State[];
  places: Place[];
  placescards: PlaceCard[] = [];
  adherent: Adherent;
  collections: Collection[];
  constructor(private placeService: PlacesService, private stateService: StatesService, private imageService: ImagesService,
              private reactionService: ReactionsService, private adherentService: AdherentsService, private tokenService: TokensService,
              private snackbar: MatSnackBar, private router: Router, private collectionService: CollectionsService,
              public dialog: MatDialog) {
    this.adherent = new Adherent();
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
        this.imageService.getAllImagesOfPlace(place.id).subscribe(
          (images) => {
            placecard.images = images;
            for (let j = 0; j < placecard.images.length; j++) {
              placecard.indexes.push(j);
            }
            if (this.adherent) {
              this.reactionService.checkReactedTo(this.adherent.id, placecard.place.id).subscribe(
                (data) => {
                  placecard.reaction = data;
                  this.placescards.push(placecard);
                });
            } else {
              this.placescards.push(placecard);
            }
          }
        );
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
  onFavoris(placecard: PlaceCard) {
    if (this.adherent) {
      if (placecard.reaction.is_favoris === undefined) {
        placecard.reaction = new Reaction();
        placecard.reaction.is_favoris = 1;
        placecard.reaction.place_id = placecard.place.id;
        placecard.reaction.is_like = 0;
        this.reactionService.addReaction(placecard.reaction, this.adherent.id).subscribe(
          (data) => {
            placecard.reaction = data;
          }
        );

      } else if (placecard.reaction.is_favoris === 1) {
        placecard.reaction.is_favoris = 0;
        this.reactionService.updateReaction(placecard.reaction).subscribe(
          (data) => {
            placecard.reaction = data;
            if (placecard.reaction.is_like === 0) {
              this.reactionService.deleteReaction(placecard.reaction).subscribe(
                () => {
                  placecard.reaction = new Reaction();
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
        panelClass: ['blue-snackbar'],
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
      this.router.navigate(['/user/loginregister']);
    }
  }

  onLike(placecard: PlaceCard) {
    if (this.adherent) {
      if (placecard.reaction.is_like === undefined) {
        placecard.reaction = new Reaction();
        placecard.reaction.is_like = 1;
        placecard.reaction.place_id = placecard.place.id;
        placecard.reaction.is_favoris = 0;
        this.reactionService.addReaction(placecard.reaction, this.adherent.id).subscribe(
          (data) => {
            placecard.reaction = data;
          }
        );

      } else if (placecard.reaction.is_like === 1) {
        placecard.reaction.is_like = 0;
        this.reactionService.updateReaction(placecard.reaction).subscribe(
          (data) => {
            placecard.reaction = data;
            if (placecard.reaction.is_favoris === 0) {
              this.reactionService.deleteReaction(placecard.reaction).subscribe(
                () => {
                  placecard.reaction = new Reaction();
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
        panelClass: ['blue-snackbar'],
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
      this.router.navigate(['/user/loginregister']);
    }
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

  ngOnInit() {
    this.getAdherent();
    this.getAllPlaces();
  }

}
