import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  constructor(private auth: AuthService) {}

  ngOnInit() {}
  onLogout() {
    alert('LogOut Called');
    this.auth.logout();
  }
}
