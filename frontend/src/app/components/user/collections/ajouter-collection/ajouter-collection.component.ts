import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CollectionsService } from 'src/app/services/collections.service';
import { Collection } from 'src/app/models/collection';
import { Adherent } from 'src/app/models/adherent';

@Component({
  selector: 'app-ajouter-collection',
  templateUrl: './ajouter-collection.component.html',
  styleUrls: ['./ajouter-collection.component.scss']
})
export class AjouterCollectionComponent implements OnInit {
  collection: Collection;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any , public dialogRef: MatDialogRef<AjouterCollectionComponent>,
              private collectionService: CollectionsService) {
    this.collection = new Collection();
   }

  ngOnInit() {

  }

  onCreate() {
    this.collectionService.addCollection(this.collection, this.data.id).subscribe(
     (data) => {
        this.onClose(data);
     });
  }




  onClose(collection: Collection) {
    this.dialogRef.close(collection);
  }

}
