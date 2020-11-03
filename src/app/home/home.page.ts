import { Component, OnInit } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';



declare var google: any;

interface Marker {
  position : {
    lat: number,
    lng: number
  };
  title: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  map : any;
  directionsService = new google.maps.DirectionsService(); //Guarda el calculo la ruta optima entre 2 puntos
  directionsDisplay = new google.maps.DirectionsRenderer(); //Se encarga de pintar la rutra optima.

  @ViewChild('map',{read: ElementRef, static:false}) mapref : ElementRef;
  @ViewChild('indicators',{read: ElementRef, static:false}) indicatorsref : ElementRef;

  myPosition : Marker = {
    title :"home",
    position : {
      lat:0,
      lng:0
    }
  };

  myDestination : Marker = {
    title: "Real Plaza Salaverry",
      position:{
        lat: -12.0897602,
        lng: -77.0581753
    }
  }

  infoWindows: any [];
  markers : Marker[] = [
    {
      title: "Wong 2 mayo",
      position : {
        lat: -12.0919887,
        lng: -77.0440453
      }
    },
    {
      title: "Vivanda 2 Mayo",
      position: {
        lat: -12.0919791,
        lng: -77.0440344
      }
    },
    {
      title: "La choza nautica",
      position : {
        lat: -12.0873377,
        lng: -77.045654
      }
    },
    {
      title: "Real Plaza Salaverry",
      position:{
        lat: -12.0897602,
        lng: -77.0581753
      }
    },
    {
      title: "Lavadero de carros",
      position: {
        lat: -12.0875221,
        lng: -77.0310684
      }
    }
  ]

  constructor(private geo : Geolocation) {}

  ngOnInit(){

    this.geo.getCurrentPosition().then((resp)=>{
      console.log(`${resp.coords.latitude} , ${resp.coords.longitude}`);
      this.myPosition.position.lat = resp.coords.latitude;
      this.myPosition.position.lng = resp.coords.longitude; 
      this.myPosition.title = "home";
      console.log(this.myPosition);
      this.showMap();
    }).catch((erro)=> {
      console.log('error getting location',erro);
    });
  }
  

  ionViewDidEnter(){



  }

  //forma 1
  // addMakersToMap(markers){
  //   for(let marker of markers){
  //     let position = new google.maps.LatLng(marker.latitude, marker.longitude);
  //     let mapMarker = new google.maps.Marker({
  //       position : position,
  //       title : marker.title,
  //       latitude : marker.latitude,
  //       longitude: marker.longitude
  //     });

  //     mapMarker.setMap(this.map);
  //     //this.addInfoWindowsToMarker(mapMarker);
  //   }
  // }

  addInfoWindowsToMarker(marker) {
    let infoWindowContent = '<div id="content">' +
                            '<h2 id="firtsheading" class="firtsheading">' + marker.title + '</h2>' +
                            '<p>Latitude: ' + marker.latitude + '</p>' +
                            '<p>Longitude: ' + marker.longitude + '</p>' +
                            '</div>';
    
    let infoWindow = new google.maps.infoWindow({
      content : infoWindowContent
    });

    marker.addListener('click',()=> {
      this.closeAllInfoWindows();
      infoWindow.open(this.map, marker);
    });
    this.infoWindows.push(infoWindow);
  }

  closeAllInfoWindows(){
    for(let window of this.infoWindows){
      window.close();
    }
  }

  showMap(){
    const location = new google.maps.LatLng(this.myPosition.position);
    const options = {
      center: location,
      zoom : 15,
      disableDefaultUI : true
    }
    this.map = new google.maps.Map(this.mapref.nativeElement, options);

    this.directionsDisplay.setMap(this.map);
    this.directionsDisplay.setPanel(
      document.getElementById("indicators") as HTMLElement
    );
   

    //forma 1 de mostrar los markers
    //this.addMakersToMap(this.markers);

    //forma 2 nicobytes
    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      this.addMarker(this.myPosition);
      //this.map.classList.add('show-map');
      this.calculateRoute();
    })

  }
  private calculateRoute() {
    this.directionsService.route({
      origin : this.myPosition.position,
      destination : this.myDestination.position,
      travelMode : google.maps.TravelMode.DRIVING,
    }, (response, status) => {
      if(status === google.maps.DirectionsStatus.OK){
        this.directionsDisplay.setDirections(response);
      } else {
        alert('Could not display directions due to : ' + status);
      }
    });
  }

  addMarker(marker : Marker) {
    return new google.maps.Marker({
      position : marker.position,
      map: this.map,
      title : marker.title
    });
  }
}
