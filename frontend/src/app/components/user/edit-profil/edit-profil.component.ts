import { Component, OnInit } from '@angular/core';
import { AdherentsService } from 'src/app/services/adherents.service';
import { Adherent } from 'src/app/models/adherent';
import { TokensService } from 'src/app/services/tokens.service';
import { ImagesService } from 'src/app/services/images.service';

@Component({
  selector: 'app-edit-profil',
  templateUrl: './edit-profil.component.html',
  styleUrls: ['./edit-profil.component.scss']
})
export class EditProfilComponent implements OnInit {
  updateadherent: Adherent;
  newpassword: string;
  selectedFile: File = null;
  constructor(private adherentService: AdherentsService, private tokenService: TokensService, private imageService: ImagesService) {
    this.updateadherent = new Adherent();
  }
  showImage(files: FileList) {
    const fd = new FormData();
    this.selectedFile = files.item(0);
    fd.append('photo', this.selectedFile, this.selectedFile.name);
    this.imageService.deleteImage(this.updateadherent.photo.slice(this.updateadherent.photo.lastIndexOf('/') + 1), 'adherents').subscribe();
    this.updateadherent.photo = this.selectedFile.name;
    this.imageService.saveImage(fd).subscribe(
      () => {
        const im = document.getElementById('imag');
        im.setAttribute('src', 'http://127.0.0.1:8000/images/' + this.selectedFile.name);
        im.style.borderRadius = '50%';
        im.style.width = '100px';
        im.style.height = '100px';
      });
  }
  getAdherentProfil() {
    const token = this.tokenService.getToken();
    this.adherentService.adherentInfos(token).subscribe(
      (data) => {
        this.updateadherent = data;
        const im = document.getElementById('imag');
        im.setAttribute('src', this.updateadherent.photo);
        im.style.borderRadius = '50%';
        im.style.width = '100px';
        im.style.height = '100px';
      });
  }
  onUpdate() {
   if (this.newpassword !== undefined) {
    this.updateadherent.password = this.newpassword;
   }
   const token = this.tokenService.getToken();
   this.adherentService.updateAdherent(this.updateadherent, token).subscribe(
     () => {
       window.location.reload();
   });
  }

  ngOnInit() {
    this.getAdherentProfil();
  }

}
