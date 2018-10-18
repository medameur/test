import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { WeatherProvider } from './../providers/weather/weather';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';
 
import { HomePage } from '../pages/home/home';

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit, AfterViewInit{
  @ViewChild(Nav) nav: Nav;
  rootPage:string = HomePage;

  pages: any[] = [];
  location = {};
  weather: any;
  forecast: any;

  hideDelete = false;
  loc: string;
  weatherUnits = [];

  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    private weatherProvider: WeatherProvider,
    private storage: Storage,
    private events: Events,
    private alertCtrl: AlertController
  ) {
    this.initializeApp();
    }

    ngOnInit() {
      this.storage.forEach((value, key, index) => {
        this.pages.push(JSON.parse(value));
      });
    }
  
    ngAfterViewInit() {
      this.weatherProvider.getPosition().then(resp => {
        this.weatherProvider.currentWeather(resp.coords.longitude, resp.coords.latitude)
          .subscribe(res => {

            if(res.length > 0){
          console.log("res res res >>> ",res);
         // console.log(" >>> ",res[0].name);
 
          if(!res[0].name){
          res[0]= JSON.parse(res[0]._body);
          }

           if(!res[1].name){
             res[1]= JSON.parse(res[1]._body);
          }
             
              this.weather = res[0];
              this.loc = res[0].name;
  
              this.location = {
                id: res[0].id,
                icon: `http://openweathermap.org/img/w/${res[0].weather[0].icon}.png`,
                current: res[0],
                forecast: res[1]
              }

              this.storage.set(`location ${res[0].id}`, JSON.stringify(this.location));
  
              if(this.pages.length <= 0){
                this.events.publish("cityinfo", this.location);
              }

          console.log("this.location5 >>> ",this.location);
              
              this.nav.setRoot("HomePage", {"weatherInfo": this.location});
            }
          });
      });
  
      this.events.subscribe("cityinfo", (data) => {
        this.pages.push(data);
      });
    }
    initializeApp() {
      this.platform.ready().then(() => {
        this.statusBar.styleDefault();
        this.splashScreen.hide();
      });
    }

  }

