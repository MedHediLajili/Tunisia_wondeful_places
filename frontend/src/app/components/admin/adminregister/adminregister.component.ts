import { Component, OnInit } from '@angular/core';
import { AdminsService } from 'src/app/services/admins.service';
import { Admin } from 'src/app/models/admin';
import { TokensService } from 'src/app/services/tokens.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-adminregister',
  templateUrl: './adminregister.component.html',
  styleUrls: ['./adminregister.component.scss']
})
export class AdminregisterComponent implements OnInit {
  admin: Admin;

  constructor(private adminService: AdminsService, private tokenService: TokensService, private router: Router,
              private snackbar: MatSnackBar) {
    this.admin = new Admin();
  }

  onRegister() {
    this.adminService.register(this.admin).subscribe(
      (data) => {
        if (data.success) {
          this.tokenService.setToken(data.token);
          this.router.navigate(['/admin/home']);
        } else {
          this.admin.email = '';
          this.snackbar.open(data.error, 'Close', {
            duration: 5000,
            verticalPosition: 'top'
          });
        }
      });
  }

  ngOnInit() {
  }

}
