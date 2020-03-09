import { Component, OnInit } from '@angular/core';
import { StatesService } from 'src/app/services/states.service';
import { State } from 'src/app/models/state';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ImagesService } from 'src/app/services/images.service';
import { Place } from 'src/app/models/place';
import { PlacesService } from 'src/app/services/places.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-ajouter-lieu',
  templateUrl: './ajouter-lieu.component.html',
  styleUrls: ['./ajouter-lieu.component.scss']
})
export class AjouterLieuComponent implements OnInit {
  selectedFile: File = null;
  place: Place;
  states: State[];
  selectedState: State;
  ajoutPlaceForm: FormGroup;
  taille = 0 ;

  constructor(private stateService: StatesService, private fb: FormBuilder, private imageService: ImagesService ,
              private placeService: PlacesService, private router: Router, private snackbar: MatSnackBar ) {
    this.place = new Place();
    this.createForm();
    this.getStates();
  }

  createForm() {
    this.ajoutPlaceForm = this.fb.group({
      name: [''],
      description: [''],
      images: this.fb.array([this.buildImage()]),
    });
  }

  getImages(): FormArray {
    return this.ajoutPlaceForm.get('images') as FormArray;
  }

  addImage(): void {
    this.getImages().push(this.buildImage());
    this.taille++;
  }

  removeImage(i): void {

    const str = this.getImages().at(i).value.image;
    const namephoto = str.slice(str.lastIndexOf('\\') + 1);
    this.imageService.deleteImage(namephoto, 'images').subscribe(
      () => {
        this.getImages().removeAt(i);
        this.taille--;
    });
  }

  buildImage(): FormGroup {
    return this.fb.group({
      image: ['']
    });
  }

  showImage(files: FileList , i) {
    const fd = new FormData();
    this.selectedFile = files.item(0);
    fd.append('photo',  this.selectedFile, this.selectedFile.name);
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
      this.states = data ;
   });
  }

  onSubmit() {
   /*const imagespath = [];
      for (let i = 0 ; i <= this.taille ; i++) {
        const str = document.getElementById('imag' + i).getAttribute('src');
        imagespath.push(str.slice(str.lastIndexOf('/') + 1));
    }
    for (let i = 0 ; i <= this.taille ; i++) {
      console.log(imagespath[i]);
    }*/
  this.place.name = this.ajoutPlaceForm.get('name').value ;
  this.place.description = this.ajoutPlaceForm.get('description').value;
  this.placeService.addPlace(this.selectedState.id, this.place).subscribe(
    (place) => {
      const imagespath = [];
      for (let i = 0 ; i <= this.taille ; i++) {
        const str = document.getElementById('imag' + i).getAttribute('src');
        imagespath.push(str.slice(str.lastIndexOf('/') + 1));
    }
      for (let i = 0 ; i <= this.taille ; i++) {
        this.imageService.addImageToPlace(place.id, imagespath[i]).subscribe();
      }
      this.snackbar.open('Place Added Sucessfuly', 'Close', {
        duration: 2000,
        verticalPosition: 'top'
      });
      this.router.navigate(['/admin/home/listelieux']);
  });
}

  ngOnInit() {
  }

}
