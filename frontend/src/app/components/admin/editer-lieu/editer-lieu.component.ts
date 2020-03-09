import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { State } from 'src/app/models/state';
import { Image } from 'src/app/models/image';
import { StatesService } from 'src/app/services/states.service';
import { ImagesService } from 'src/app/services/images.service';
import { Place } from 'src/app/models/place';
import { PlacesService } from 'src/app/services/places.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-editer-lieu',
  templateUrl: './editer-lieu.component.html',
  styleUrls: ['./editer-lieu.component.scss']
})
export class EditerLieuComponent implements OnInit {
  selectedFile: File = null;
  editPlaceForm: FormGroup;
  states: State[];
  images: Image[];
  place: Place;
  selectedState: string;
  // tslint:disable-next-line: variable-name
  taille_new_photos = 0;
  // tslint:disable-next-line: variable-name
  taille_old_photos = 0;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<EditerLieuComponent>, private fb: FormBuilder,
    private stateService: StatesService, private imageService: ImagesService, private placeService: PlacesService,
    private router: Router, private snackbar: MatSnackBar) {
    this.place = new Place();
    this.createForm();
    this.getStates();
  }


  createForm() {
    this.editPlaceForm = this.fb.group({
      name: [''],
      description: [''],
      images: this.fb.array([this.buildImage()])
    });
  }

  buildImage(): FormGroup {
    return this.fb.group({
      image: ['']
    });
  }

  getImages(): FormArray {
    return this.editPlaceForm.get('images') as FormArray;
  }

  addImage(): void {
    this.getImages().push(this.buildImage());
    this.taille_new_photos++;
  }

  removeNewImage(i): void {
    const str = this.getImages().at(i).value.image;
    const namephoto = str.slice(str.lastIndexOf('\\') + 1);
    this.imageService.deleteImage(namephoto, 'images').subscribe(
      () => {
        this.getImages().removeAt(i);
        this.taille_new_photos--;
      });
  }

  removeOldImage(j): void {
    const str = document.getElementById('photo' + j).getAttribute('src');
    const namephoto = str.slice(str.lastIndexOf('/') + 1);
    this.imageService.deleteImage(namephoto, 'places').subscribe(
      () => {
        this.images.splice(j, 1);
        this.taille_old_photos--;
      });

  }

  showImage(files: FileList, i): void {
    const fd = new FormData();
    this.selectedFile = files.item(0);
    fd.append('photo', this.selectedFile, this.selectedFile.name);
    this.imageService.saveImage(fd).subscribe(
      () => {
        const im = document.getElementById('imag' + i);
        im.setAttribute('src', 'http://127.0.0.1:8000/images/' + this.selectedFile.name);
        im.style.borderRadius = '50%';
        im.style.width = '50px';
        im.style.height = '50px';
      });
  }

  getStates() {
    this.stateService.getAllStates().subscribe(
      (data) => {
        this.states = data;
      });
  }

  initialize() {
    this.editPlaceForm.get('name').setValue(this.data.row.name);
    this.editPlaceForm.get('description').setValue(this.data.row.description);
    this.selectedState = this.data.row.state_id;
    this.imageService.getAllImagesOfPlace(this.data.row.id).subscribe(
      (data) => {
        this.images = data;
        this.taille_old_photos = this.images.length;
      });
  }

  onUpdate() {
    this.place.name = this.editPlaceForm.get('name').value;
    this.place.description = this.editPlaceForm.get('description').value;
    this.place.state_id = this.selectedState;
    this.placeService.updatePlace(this.data.row.id, this.place).subscribe(
      (place) => {
        if ((this.getImages().length !== 0) && document.getElementById('imag' + 0).getAttribute('src')) {
          const imagespath = [];
          for (let i = 0; i < this.getImages().length; i++) {
            const str = document.getElementById('imag' + i).getAttribute('src');
            imagespath.push(str.slice(str.lastIndexOf('/') + 1));
          }
          for (let i = 0; i < this.getImages().length; i++) {
            this.imageService.addImageToPlace(place.id, imagespath[i]).subscribe();
          }
        }
        this.snackbar.open('Place Updated Sucessfuly', 'Close', {
          duration: 2000,
          verticalPosition: 'top'
        });
        this.onClose();
        this.router.navigate(['/admin/home/listelieux']);
      });
  }

  onClose(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.initialize();
  }

}
