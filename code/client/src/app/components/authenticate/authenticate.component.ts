import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-authenticate',
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.css']
})
export class AuthenticateComponent implements OnInit{

  ngOnInit(): void {
    const userType = localStorage.getItem('usertype');
    if(userType){
      if (userType === 'user'){
        this.route.navigate(['/user']);
      }else if(userType === 'admin'){
        this.route.navigate(['/admin']);
      }else if(userType === 'doctor'){
        this.route.navigate(['/doctor']);
      }
    }
  }
  authType: string = 'login';
  
  changeAuthType(type: string){
    this.authType = type;
  }

  
  email:string = '';
  password:string = '';
  username: string = '';
  userType: string = '';
  
  
  constructor(private http: HttpClient, private route: Router){}

  login(){
    this.http.post('http://localhost:6001/login', {email: this.email, password: this.password}).subscribe(
        (response:any)=>{
          localStorage.setItem('userid', response._id);
          localStorage.setItem('username', response.username);
          localStorage.setItem('email', response.email);
          localStorage.setItem('usertype', response.usertype);
          localStorage.setItem('balance', response.balance);
          this.email = '';
          this.password='';

          if (response.usertype === 'user'){
            this.route.navigate(['/user']);
          }else if(response.usertype === 'admin'){
            this.route.navigate(['/admin']);
          }else if(response.usertype === 'doctor'){
            this.route.navigate(['/doctor']);
          }

        }, (error)=>{
          alert("login failed!!");
        }
    )
  }


  register (){
    this.http.post('http://localhost:6001/register', {email: this.email, password: this.password, 
                                              username: this.username, usertype: this.userType}).subscribe(
      (response:any)=>{
        localStorage.setItem('userid', response._id);
        localStorage.setItem('username', response.username);
        localStorage.setItem('email', response.email);
        localStorage.setItem('usertype', response.usertype);
        this.email = '';
        this.password='';

        if (response.usertype === 'user'){
          this.route.navigate(['/user']);
        }else if(response.usertype === 'admin'){
          this.route.navigate(['/admin']);
        }else if(response.usertype === 'doctor'){
          this.route.navigate(['/doctor']);
        }
        
      }, (error)=>{
        alert("registration failed!!");
      }
    )
  }

}
