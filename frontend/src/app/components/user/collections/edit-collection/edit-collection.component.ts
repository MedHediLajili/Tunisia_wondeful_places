import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Collection } from 'src/app/models/collection';
import { CollectionsService } from 'src/app/services/collections.service';


@Component({
  selector: 'app-edit-collection',
  templateUrl: './edit-collection.component.html',
  styleUrls: ['./edit-collection.component.scss']
})
export class EditCollectionComponent implements OnInit {
  collection: Collection;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any , public dialogRef: MatDialogRef<EditCollectionComponent>,
              private collectionService: CollectionsService) {
    this.collection = new Collection();
   }

  ngOnInit() {
    this.collection = this.data;
  }

  onUpdate() {
    this.collectionService.updateCollection(this.collection).subscribe(
     () => {
        this.onClose();
     });
  }




  onClose() {
    this.dialogRef.close();
  }


}
