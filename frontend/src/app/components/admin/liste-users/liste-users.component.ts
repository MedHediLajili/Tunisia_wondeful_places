import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Adherent } from 'src/app/models/adherent';
import { AdherentsService } from 'src/app/services/adherents.service';
import { ImagesService } from 'src/app/services/images.service';

@Component({
  selector: 'app-liste-users',
  templateUrl: './liste-users.component.html',
  styleUrls: ['./liste-users.component.scss']
})
export class ListeUsersComponent implements OnInit {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  displayedColumns: string[] = ['id', 'first_name', 'last_name', 'image', 'email' /*, 'password'*/ , 'description', 'actions'];
  listData: MatTableDataSource<Adherent>;
  adherents: Adherent[];

  constructor(private adherentService: AdherentsService, private imageService: ImagesService) { }

  getAllAdherent() {
    this.adherentService.getAllAdherent().subscribe(
      (data) => {
        this.adherents = data;
        this.listData = new MatTableDataSource(this.adherents);
        this.listData.paginator = this.paginator;
        this.listData.sort = this.sort;
    });
  }

  removeAdherent(adherent: Adherent) {
   const namephoto = adherent.photo.slice(adherent.photo.lastIndexOf('/') + 1);
   this.imageService.deleteImage(namephoto, 'adherents').subscribe();
   this.adherentService.deleteAdherent(adherent.id).subscribe(
     () => {
     this.getAllAdherent();
   });
  }
  applyFilter(filterValue: string) {
    this.listData.filter = filterValue.trim().toLowerCase();

    if (this.listData.paginator) {
      this.listData.paginator.firstPage();
    }
  }
  ngOnInit() {
    this.getAllAdherent();
  }

}
