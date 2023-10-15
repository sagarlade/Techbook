import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit{
  email: string ='';
  password: string = '';
  name: string='';
  constructor(private auth:AuthService){

  }

  ngOnInit(): void {
      
  }
  signup(){
    if(this.email==''){
      alert('Please enter email');
      return
    }
    if(this.password==''){
      alert('Please enter password');
      return
    }
    if(this.name==''){
      alert('Please enter password');
      return
    }

    this.auth.signup(this.email, this.password, this.name);
    
    this.email='';
    this.password='';
    this.name='';
  }
}
