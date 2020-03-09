import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogConfig, MatDialog, MatSnackBar } from '@angular/material';
import { AjouterCollectionComponent } from './ajouter-collection/ajouter-collection.component';
import { Adherent } from 'src/app/models/adherent';
import { TokensService } from 'src/app/services/tokens.service';
import { AdherentsService } from 'src/app/services/adherents.service';
import { CollectionsService } from 'src/app/services/collections.service';
import { Collection } from 'src/app/models/collection';
import { PlaceCard } from 'src/app/models/place-card';
import { Place } from 'src/app/models/place';
import { State } from 'src/app/models/state';
import { Reaction } from 'src/app/models/reaction';
import { ReactionsService } from 'src/app/services/reactions.service';
import { StatesService } from 'src/app/services/states.service';
import { PlacesService } from 'src/app/services/places.service';
import { ImagesService } from 'src/app/services/images.service';
import { EditCollectionComponent } from './edit-collection/edit-collection.component';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class CollectionsComponent implements OnInit {
  adherent: Adherent;
  collections: Collection[];
  collectionsPlacesCards: PlaceCard[][] = [];
  constructor(public dialog: MatDialog, private collectionService: CollectionsService, private tokenService: TokensService,
              private adherentService: AdherentsService, private reactionService: ReactionsService, private stateService: StatesService,
              private placeService: PlacesService, private imageService: ImagesService , private snackbar: MatSnackBar) {
    this.adherent = new Adherent();
  }

  openDialogAjouterNewCollection(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.height = '50%';
    dialogConfig.data = this.adherent;
    this.dialog.open(AjouterCollectionComponent, dialogConfig).afterClosed().subscribe(
      () => {
        this.getAllCollections();
      });
  }

  getAllCollections() {
  this.collectionService.getAdherentCollections(this.adherent.id).subscribe(
    (data) => {
    this.collections = data;
    for (let collection of this.collections) {
      this.getAllPlaces(collection);
    }
  });
  }

  onFavoris(placecard: PlaceCard) {
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
}

  onLike(placecard: PlaceCard) {
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
}

  getAdherent() {
    const token = this.tokenService.getToken();
    this.adherentService.adherentInfos(token).subscribe(
      (data) => {
        this.adherent = data;
        this.getAllCollections();
      }
    );
  }

  getAllPlaces(collection: Collection) {
    this.collectionsPlacesCards[collection.id] = [];
    this.collectionService.getAllPlacesOfCollection(collection.id).subscribe(
      (data) => {
        const places = data;
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < places.length; i++) {
          this.loadPlaceCard(places[i], collection.id);
        }
      }
      );
  }
  onEdit(collection: Collection) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.height = '50%';
    dialogConfig.data = collection;
    this.dialog.open(EditCollectionComponent, dialogConfig).afterClosed().subscribe(
      () => {
        this.getAllCollections();
      });
  }
  loadPlaceCard(place: Place, collectionid: string) {
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

            this.reactionService.checkReactedTo(this.adherent.id, placecard.place.id).subscribe(
              (data) => {
                placecard.reaction = data;
                this.collectionsPlacesCards[collectionid].push(placecard);
              });

          }
      );
      }
      );
  }

  addPlaceToCollection(collection: Collection , placecard: PlaceCard) {
    this.collectionService.addPlaceToCollection(collection.id, placecard.place.id).subscribe(
        () => {
          this.collectionsPlacesCards[collection.id].push(placecard);
          this.snackbar.open('Place sucessfuly added to Collection', 'Close', {
            duration: 4000,
            panelClass: ['pink-snackbar'],
            horizontalPosition: 'center',
            verticalPosition : 'bottom',
          });
        }
    );
  }

  deletePlaceFromCollection(collection: Collection, placecard: PlaceCard) {
  this.collectionService.removePlaceFromCollection(collection.id, placecard.place.id).subscribe(
    () => {
      this.collectionsPlacesCards[collection.id].splice(this.collectionsPlacesCards[collection.id].indexOf(placecard), 1);
      this.snackbar.open('Place have been deleted from Collection', 'Close', {
        duration: 4000,
        panelClass: ['pink-snackbar'],
        horizontalPosition: 'center',
        verticalPosition : 'bottom',
      });
    });
  }

  deleteCollection(collection: Collection) {
    this.collectionService.getAllPlacesOfCollection(collection.id).subscribe(
      (data) => {
        console.log(data);
        if (data.length !== 0) {
          // tslint:disable-next-line: prefer-for-of
          for (let i = 0 ; i < data.length ; i++) {
            this.collectionService.removePlaceFromCollection(collection.id , data[i].id).subscribe(
              () => {
                this.collectionService.deleteCollection(collection.id).subscribe(
                  () => {
                    this.getAllCollections();
                    this.snackbar.open('Collection was deleted', 'Close', {
                      duration: 4000,
                      panelClass: ['pink-snackbar'],
                      horizontalPosition: 'center',
                      verticalPosition : 'bottom',
                    });
                });
            });
        }
      } else {
        this.collectionService.deleteCollection(collection.id).subscribe(
          () => {
            this.getAllCollections();
            this.snackbar.open('Collection was deleted', 'Close', {
              duration: 4000,
              panelClass: ['pink-snackbar'],
              horizontalPosition: 'center',
              verticalPosition : 'bottom',
            });
        });
      }
    });
  }



  ngOnInit() {
    this.getAdherent();
  }


}
