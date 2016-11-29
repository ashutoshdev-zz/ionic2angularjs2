import { Component } from '@angular/core';
import {Http} from '@angular/http';
import {NavController} from 'ionic-angular';
import {OrderService} from '../services/OrderService';
@Component({
  templateUrl: 'home.html',
  providers: [OrderService]
  
})

export class HomePage {
	public image_logo: string = "assets/img/Ginja_logowhite.png";
    order: Array<any>;
	ordera: Array<any>;
  constructor(private navController: NavController, private OrderService: OrderService) {
 
  }

	
	
	
	
searchOrderDBa() {
        
            this.OrderService.accessToken().subscribe(
                data => {
                    this.ordera = data; 
					console.log(data.access_token);
                    this.savetoken(data.access_token);
                },
                err => {
                    //console.log(err);
                },
                () => console.log('Order Search Complete')
            );
        
    } 
	
savetoken(token) {
  if(token) {
    localStorage.setItem('id_token', token)
  }
}

searchOrderDB() {
	var id_token=localStorage.getItem('id_token');
       
            this.OrderService.searchOrder(id_token).subscribe(
                data => {
					
                    this.order = data;
					 console.log(data);
					 
                    console.log(data[0].address);
					
					console.log(data[0].customer);
					console.log(data[0].products[0]);
                },
                err => {
                    console.log(err);
                },
                () => console.log('Order Search Complete')
            );
       
    }
	
	
ngOnInit() {
  this.searchOrderDBa();
  }	

}
