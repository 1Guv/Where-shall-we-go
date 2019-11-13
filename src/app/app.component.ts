import { Component, OnInit } from '@angular/core';
import { DataService } from './data.service';
import { FormControl } from '@angular/forms';
import { MaterialModule } from './material-module';

export interface Data {
  venues: Array<Venues>;
  people: Array<People>;
}

export interface Venues {
  name: string;
  food: Array<string>;
  drinks: Array<string>;
}

export interface People {
  name: string;
  food: Array<string>;
  drinks: Array<string>;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  title = 'where-shall-we-go';
  data: Data;
  venues: Venues[];
  people: People[];
  peopleForm = new FormControl();

  venuesWeCantGoToEat = [];
  venuesWeCanGoToEat = [];

  venuesWeCantGoToForDrinks = [];
  venuesWeCanGoToForDrinks = [];

  venuesWhereWeCanEatAndDrink = [];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.getJsonData();
    this.venuesWeCanGoToEat = this.venues;
  }

  async getJsonData() {
    this.dataService.getData()
      .subscribe(data => {
        console.log('data', data);
        this.data = data;
        this.venues = data.venues;
        this.people = data.people;
      });
  }

  whereShallWeEat(selectedPerson: FormControl) {
    console.log('selectedPerson', selectedPerson);

    this.filterForFood(selectedPerson);
    this.filterForDrinks(selectedPerson);

    this.venuesWhereWeCanEatAndDrink = this.venuesWeCanGoToEat.filter(venue => this.venuesWeCanGoToForDrinks.includes(venue));
  }

  filterForFood(selectedPerson: FormControl) {
    let wontEatArray = [];
    let venuesWeCantGoToEat = [];

    if (selectedPerson.value) {
      selectedPerson.value.forEach(food => {
        wontEatArray.push(food.wont_eat);
      });
    }

    // Flattens the array of arrays to create one array
    wontEatArray = [].concat(...wontEatArray);

    // Removes duplicate food types from the array
    wontEatArray = [...new Set(wontEatArray)];

    console.log('wontEatArray', wontEatArray);

    const allVenues = [];

    for (let i = 0; i < wontEatArray.length; i++) {
      this.venues.forEach(venue => {
        allVenues.push(venue.name);
        venue.food.forEach(venueFood => {
          if (venueFood === wontEatArray[i]) {
            venuesWeCantGoToEat.push(venue.name);
          }
        });
      });
    }

    // Removes duplicate venues from the array
    venuesWeCantGoToEat = [...new Set(venuesWeCantGoToEat)];
    this.venuesWeCantGoToEat = venuesWeCantGoToEat;

    // Creates a list of venues that the people can go to
    this.venuesWeCanGoToEat = allVenues.filter(venueName => !venuesWeCantGoToEat.includes(venueName));

    // Removes duplicate venues from the array
    this.venuesWeCanGoToEat = [...new Set(this.venuesWeCanGoToEat)];
  }

  filterForDrinks(selectedPerson: FormControl) {
    let drinksArray = [];
    let venuesWeCanGoToForDrinks = [];

    if (selectedPerson.value) {
      selectedPerson.value.forEach(drink => {
        drinksArray.push(drink.drinks);
      })
    }

    // Flattens the array of arrays to create one array
    drinksArray = [].concat(...drinksArray);

    // Removes duplicate food types from the array
    drinksArray = [...new Set(drinksArray)];

    // All drinks in the array are converted to lowercase for matching
    drinksArray = drinksArray.map(d => d.toLowerCase());
    console.log('drinksArray', drinksArray);

    const allVenues = [];

    for (let i = 0; i < drinksArray.length; i++) {
      this.venues.forEach(venue => {
        allVenues.push(venue.name);
        venue.drinks.forEach(venueDrink => {
          if (venueDrink.toLowerCase() === drinksArray[i]) {
            venuesWeCanGoToForDrinks.push(venue.name);
          }
        });
      });
    }
    // console.log('venuesWeCanGoToForDrinks 1', venuesWeCanGoToForDrinks);

    // Removes duplicate venues from the array
    venuesWeCanGoToForDrinks = [...new Set(venuesWeCanGoToForDrinks)];
    this.venuesWeCanGoToForDrinks = venuesWeCanGoToForDrinks;
    console.log('venuesWeCanGoToForDrinks 2', venuesWeCanGoToForDrinks);

  }
}
