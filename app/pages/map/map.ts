import {Component, OnInit, ViewChild} from '@angular/core';
import {NavController, Content} from 'ionic-angular';

declare var $:any
declare var L:any

@Component({
  templateUrl: 'build/pages/map/map.html'
})
export class MapPage implements OnInit {
  @ViewChild(Content) content: Content;

  private map: any

  constructor(private navController: NavController) {}

  ngOnInit() {
  	this.map = L.map(this.content.getNativeElement());
  	
  	this.map.setView([37.76, -122.44], 11);
  	this.map.locate({setView: true, maxZoom: 16});

  	L.tileLayer('https://findme.danielscrivano.com/tiles/{z}/{x}/{y}.png').addTo(this.map);
  }
}
