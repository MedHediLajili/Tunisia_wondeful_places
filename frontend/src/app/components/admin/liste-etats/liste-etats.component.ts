import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MatDialogConfig, MatDialog } from '@angular/material';
import { EditerEtatComponent } from '../editer-etat/editer-etat.component';
import { StatesService } from 'src/app/services/states.service';
import { State } from 'src/app/models/state';
import { PlacesService } from 'src/app/services/places.service';
import { ImagesService } from 'src/app/services/images.service';
import { Place } from 'src/app/models/place';
import { Image } from 'src/app/models/image';
@Component({
  selector: 'app-liste-etats',
  templateUrl: './liste-etats.component.html',
  styleUrls: ['./liste-etats.component.scss']
})
export class ListeEtatsComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns: string[] = ['id', 'name', 'description', 'actions'];
  listData: MatTableDataSource<State>;
  states: State[];

  constructor(private dialog: MatDialog, private stateService: StatesService, private placeService: PlacesService,
    private imageService: ImagesService) { }

  getStates() {
    this.stateService.getAllStates().subscribe(
      (data) => {
        this.states = data;
        this.listData = new MatTableDataSource(this.states);
        this.listData.paginator = this.paginator;
        this.listData.sort = this.sort;
      });
  }

  EditerState(row: State): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '48%';
    dialogConfig.height = '84%';
    dialogConfig.data = { row };
    this.dialog.open(EditerEtatComponent, dialogConfig).afterClosed().subscribe(
      () => {
        this.getStates();
      });
  }

  onDelete(id: string) {
    let places: Place[] = [];
    this.stateService.getPlacesOfState(id).subscribe(
      (data) => {
        console.log(data);
        places = data;
        // tslint:disable-next-line: prefer-for-of
        for (let j = 0; j < places.length; j++) {
          let images: Image[];
          this.imageService.getAllImagesOfPlace(places[j].id).subscribe(
            (photos) => {
              console.log(photos);
              images = photos;
              // tslint:disable-next-line: prefer-for-of
              for (let i = 0; i < images.length; i++) {

                const str = images[i].url;
                const namephoto = str.slice(str.lastIndexOf('/') + 1);
                console.log(namephoto);
                this.imageService.deleteImage(namephoto, 'places').subscribe();
              }
              this.stateService.removeState(id).subscribe(
                () => {
                  this.getStates();
                });
            });
        }
      });

  }


  applyFilter(filterValue: string) {
    this.listData.filter = filterValue.trim().toLowerCase();

    if (this.listData.paginator) {
      this.listData.paginator.firstPage();
    }
  }

  ngOnInit() {
    this.getStates();
  }

}
