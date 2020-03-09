import { Component, OnInit, Output , EventEmitter } from '@angular/core';
import { Admin } from 'src/app/models/admin';
import { AdminsService } from 'src/app/services/admins.service';
import { TokensService } from 'src/app/services/tokens.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  admin: Admin;

  @Output() toggleSidenav = new EventEmitter<void>();
  constructor(private adminService: AdminsService, private tokenService: TokensService, private router : Router) {
    this.admin = new Admin();
  }

  ngOnInit() {
   this.adminService.adminInfos(this.tokenService.getToken()).subscribe(
     (data) => {
     this.admin = data ;
   });
  }
  onLogout() {
    console.log('tokennnnnnnnnnn');
    this.adminService.logout(this.tokenService.getToken()).subscribe(
      (data) => {
      this.tokenService.deleteToken();
      this.router.navigate(['/admin']);
    });
  }
  onEdit() {
   const admin1 = new Admin();
   admin1.id = this.admin.id;
   admin1.email = 'alilll@gmail.com';
   admin1.pseudo = 'pipi';
   this.adminService.updateAdmin(admin1).subscribe(
     (data) => {
      this.admin = data ;
   });
  }

}
