import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit{
  adminDisplayContent: string = 'doctors';
  NotificationDisplay: boolean = false;

  doctors: any[] = [];
  users: any[] = [];
  bookings: any[] = [];

  availableDoctors: any[] = [];
  approvalDoctors: any[] = [];

  ngOnInit(): void {
      this.fetchDoctors();
      this.fetchUsers();
      this.fetchBookings();
  }

  constructor(private http: HttpClient, private route: Router){}

  fetchDoctors(){
    this.http.get<any>('http://localhost:6001/fetch-doctors').subscribe(
      (response)=>{
        this.doctors = response;
        this.availableDoctors = response.filter((doctor: any) => doctor.approval === 'approved');
        this.approvalDoctors = response.filter((doctor: any) => doctor.approval !== 'approved');
      }
    )
  }


  // approve doctor

  approveDoctor(doctorId: any){
    
    this.http.put<any>('http://localhost:6001/approve-doctor', {doctorId}).subscribe(
      (response)=>{
        alert("Request approved!!");
        this.fetchDoctors();
      }
    )
  }


  // reject doctor

  rejectDoctor(doctorId: any){
    this.http.put<any>('http://localhost:6001/reject-doctor', {doctorId}).subscribe(
      (response)=>{
        alert("Request suspended!!");
        this.fetchDoctors();
      }
    )
  }


  // fetch all users

  fetchUsers(){
    this.http.get<any>('http://localhost:6001/fetch-users').subscribe(
      (response)=>{
        this.users = response;
      }
    )
  }


  // fetch bookings

fetchBookings(){
  this.http.get<any>('http://localhost:6001/fetch-bookings').subscribe(
    (response)=>{
        this.bookings = response.reverse();
    }
  )
}


// Cancel bookings

cancelBooking(bookingId:any){
  this.http.post<any>('http://localhost:6001/cancel-booking', {bookingId, status: 'Cancelled by Doctor'}).subscribe(
    (response)=>{
      alert("Appointment cancelled!!");
      this.fetchBookings();
    }
  ), (error: any)=>{
    alert("Operation failed!!");
  }
}



  logout (){
    localStorage.clear();
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        localStorage.removeItem(key);
      }
    }
    this.route.navigate(['']);
  }


}
