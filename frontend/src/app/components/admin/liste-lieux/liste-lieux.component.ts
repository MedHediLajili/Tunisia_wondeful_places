import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialogConfig, MatDialog } from '@angular/material';
import { EditerLieuComponent } from '../editer-lieu/editer-lieu.component';
import { Place } from 'src/app/models/place';
import { Image } from 'src/app/models/image';
import { PlacesService } from 'src/app/services/places.service';
import { ImagesService } from 'src/app/services/images.service';

@Component({
  selector: 'app-liste-lieux',
  templateUrl: './liste-lieux.component.html',
  styleUrls: ['./liste-lieux.component.scss']
})
export class ListeLieuxComponent implements OnInit {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  displayedColumns: string[] = ['id', 'name', 'description', 'actions'];
  listData: MatTableDataSource<Place>;
  places: Place[];

  constructor(private dialog: MatDialog, private placeService: PlacesService, private imageService: ImagesService) { }

  getPlaces() {
   this.placeService.getAllPlaces().subscribe(
     (data) => {
      this.places = data;
      this.listData = new MatTableDataSource(this.places);
      this.listData.paginator = this.paginator;
      this.listData.sort = this.sort;
   });
  }
  EditerPlace(row: Place): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '65%';
    dialogConfig.height = '97%';
    dialogConfig.data = {row};
    this.dialog.open(EditerLieuComponent, dialogConfig).afterClosed().subscribe(
      () => {
       this.getPlaces();
    });
  }

  removePlace(place: Place) {

    let images: Image [] ;
    this.imageService.getAllImagesOfPlace(place.id).subscribe(
      (data) => {
       images = data;
       // tslint:disable-next-line: prefer-for-of
       for (let i = 0 ; i < images.length;  i++) {

        const str =  images[i].url;
        const namephoto = str.slice(str.lastIndexOf('/') + 1);
        this.imageService.deleteImage(namephoto, 'places').subscribe();
       }
       this.placeService.deletePlace(place.id).subscribe(
        () => {
         this.getPlaces();
      });
    });

  }

  applyFilter(filterValue: string) {
    this.listData.filter = filterValue.trim().toLowerCase();

    if (this.listData.paginator) {
      this.listData.paginator.firstPage();
    }
  }

  ngOnInit() {
    this.getPlaces();
  }

}
