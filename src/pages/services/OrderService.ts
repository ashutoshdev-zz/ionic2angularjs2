import {Http,Headers} from '@angular/http';
import 'rxjs/add/operator/map';
 
export class OrderService {  
    static get parameters() {
        return [[Http]];
    }
  
	constructor(private http:Http) {

	}
	
	accessToken() {	
	    
	   // var username = "testinguser@testingdomain.org";
       // var password = "ThisIsTheSecret";
		//var client_id = "vendor-test";
       // var client_secret = "izrLullawQLl0wAqlKmR6h4Rsnwdi3p1h";
	  //  var grant_type = "password";
		//var scope="vendor";

	    var url = 'https://betaapi.ginja.co.th/api/v1/oauth/access_token';
		var headers= new Headers();
	 
        headers.append('Content-Type', 'application/json');
		
	var dt={
"client_id": "vendor-test",
"client_secret": "izrLullawQLl0wAqlKmR6h4Rsnwdi3p1h",
"username": "testinguser@testingdomain.org",
"password": "ThisIsTheSecret",
"grant_type":"password",
"scope":"vendor"
};
  	
		//var body="client_id="+client_id+"&client_secret="+client_secret+"&username="+username+"&password=" +password+"&grant_type="+grant_type+"&scope="+scope;		
        var response = this.http.post(url,dt,{headers: headers}).map(res => res.json());
        return response;
 
    }
	
	searchOrder(token) {	
	
	    var headers= new Headers();	 
        headers.append('authorization', 'Bearer '+token);
	      var url = 'https://betaapi.ginja.co.th/api/v2/vendor/orders/current';		
        var response = this.http.get(url,{headers: headers}).map(res => res.json());
        return response;
 
    }
	
   savetoken(token) {
  if(token) {
    localStorage.setItem('id_token', token)
  }
}

}