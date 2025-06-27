import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.css']
})
export class DoctorComponent implements OnInit {

  doctorDisplayContent: string = 'home';
  NotificationDisplay: boolean = false;
  bookingDoctorId: string = '';

  username: string|null = localStorage.getItem('username');
  userId: string|null = localStorage.getItem('userid');

  bookings: any[] = [];

  constructor(private route: Router, private http: HttpClient){}


  ngOnInit(): void {
        this.fetchDoctor(localStorage.getItem('userid'));
        this.fetchBookings();
  }


  doctorId: string = '';
  hospital:string = '';
  address: string = '';
  fee: number = 0;
  experience: number = 0;
  specialization: string = '';
  availableFrom: string = '';
  availableTo: string = '';

  // fetch doctor details
  async fetchDoctor(userId:any){
      this.http.get<any>(`http://localhost:6001/fetch-doctor/${userId}`).subscribe(
        (response)=>{
          if(response === null){
          } else{
            this.doctorId = response._id;
            this.hospital = response.hospital;
            this.address = response.address;
            this.fee = response.fee;
            this.experience = response.experience;
            this.specialization = response.specialization;
            this.availableFrom = response.availableFrom;
            this.availableTo = response.availableTo;
          }
        }
      ), (error:any)=>{
        console.log(error);
      }
  }

// update details

updateData(){
  this.http.post<any>('http://localhost:6001/update-doctor-data', {userId: this.userId, doctorName: this.username, hospital: this.hospital, address: this.address, fee: this.fee, experience: this.experience, specialization: this.specialization, availableFrom: this.availableFrom, availableTo: this.availableTo }).subscribe(
    (response)=>{
      alert("updated!!");
      this.fetchDoctor(localStorage.getItem('userid'));
    }
  ), (error:any)=>{
    alert('Update failed!!');
  }
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
