import { Component, OnInit } from '@angular/core';
import { Admin } from 'src/app/models/admin';
import { AdminsService } from 'src/app/services/admins.service';
import { TokensService } from 'src/app/services/tokens.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-adminlogin',
  templateUrl: './adminlogin.component.html',
  styleUrls: ['./adminlogin.component.scss']
})
export class AdminloginComponent implements OnInit {
  admin: Admin;
  constructor(private adminService: AdminsService , private tokenService: TokensService ,
              private snackbar: MatSnackBar , private router: Router ) {
    this.admin = new Admin();
  }

  onLogin() {
   this.adminService.login(this.admin).subscribe(
     (data) => {
       if (data.success) {
        this.tokenService.setToken(data.token);
        this.router.navigate(['/admin/home']);
        this.snackbar.open('Welcome', 'Close', {
          duration: 4000,
          verticalPosition: 'bottom'
        });
       } else {
        this.snackbar.open(data.message, 'Close', {
          duration: 4000,
          verticalPosition: 'bottom'
        });
       }
   });

  }
  ngOnInit() {
  }

}
