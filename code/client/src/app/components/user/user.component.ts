import { Time } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Moment } from 'moment';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {

  userDisplayContent: string = 'home';
  NotificationDisplay: boolean = false;
  bookingDoctorId: string = '';

  username: string|null = localStorage.getItem('username');
  userId: string|null = localStorage.getItem('userid');

  doctors: any[] = [];
  bookings: any[] = [];

  availableDoctors: any[] = [];

  bookingDateTime: string = '';

  ngOnInit(): void {
      this.fetchDoctors();
      this.fetchBookings();
  }

  constructor(private http: HttpClient, private route: Router){}

  fetchDoctors(){
    this.http.get<any>('http://localhost:6001/fetch-doctors').subscribe(
      (response)=>{
        this.doctors = response;
        this.availableDoctors = response.filter((doctor: any) => doctor.approval === 'approved');
      }
    )
  }

  fetchBookings(){
    this.http.get<any>('http://localhost:6001/fetch-bookings').subscribe(
      (response)=>{
          this.bookings = response.filter((booking: any)=> booking.userId === this.userId).reverse();
      }
    )
  }

  


  handleBooking(doctorId: any, availableFrom: any, availableTo: any){
    const currentDate = new Date();

    const newDate = new Date(this.bookingDateTime);


    const newTime = new Date();
    newTime.setHours(parseInt(this.bookingDateTime.slice(11, 13)));
    newTime.setMinutes(parseInt(this.bookingDateTime.slice(14, 16)));

    
    const fromTime = new Date();
    fromTime.setHours(parseInt(availableFrom.slice(0,3)));
    fromTime.setMinutes(parseInt(availableFrom.slice(4,6)));

    const toTime = new Date();
    toTime.setHours(parseInt(availableTo.slice(0,3)));
    toTime.setMinutes(parseInt(availableTo.slice(4,6)));


    if((newDate > currentDate) && (newTime > fromTime) && (newTime < toTime) ){
      this.http.post<any>('http://localhost:6001/book-doctor', {userId: this.userId, userName: this.username, doctorId, date: this.bookingDateTime.slice(0,10), time: this.bookingDateTime.slice(11, 17)}).subscribe(
        (response)=>{
          if(response.message === 'Already booked'){
            alert("Doctor is unavailable at the time!! please choose another time")
          }else{
            alert("appointment accepted..!!");
            this.fetchBookings();
            this.bookingDateTime = '';
            this.bookingDoctorId = '';
          }
        }
      )
    } else{
      alert("Please choose available timings")
    }

    
  }


  cancelBooking(bookingId:any){
    this.http.post<any>('http://localhost:6001/cancel-booking', {bookingId, status: 'Cancelled by User'}).subscribe(
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
