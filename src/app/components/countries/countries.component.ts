import { Component, OnInit } from '@angular/core';
import { GoogleChartInterface } from 'ng2-google-charts';
import { merge } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { DateWiseData } from 'src/app/models/date-wise-data';
import { GlobalDataSummary } from 'src/app/models/global-data';
import { DataServiceService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {

  loading = true;
  globalData: GlobalDataSummary[];
  countries: string[] = [];
  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;

  dateWiseData;
  selectedCountryData: DateWiseData[] = [];

  lineChart: GoogleChartInterface = {
    chartType: 'LineChart'
  };

  constructor(private dataService: DataServiceService) { }

  ngOnInit(): void {

    merge(
      this.dataService.getDateWiseData().pipe(
        map(result => {
          this.dateWiseData = result;
        })
      ),
      this.dataService.getGlobalData().pipe(
        map(result => {
          this.globalData = result;
          this.globalData.forEach(cs => {
          this.countries.push(cs.country);
        });
        })
      )
    ).subscribe(
      {
        complete : () => {
          this.updateValues('India');
          // this.selectedCountryData = this.dateWiseData['India'];
          // this.updatechart();
          this.loading = false;
        }
      }
    );
    // this.dataService.getGlobalData().subscribe(result => {
    //   this.globalData = result;
    //   this.globalData.forEach(cs => {
    //     this.countries.push(cs.country);
    //   });
    // });
    // this.dataService.getDateWiseData().subscribe(result => {
    //   this.dateWiseData = result;
    //   // this.updatechart();
    // });
    // setTimeout(() => {
    //   // console.log(this.dateWiseData);
    //   this.updatechart();
    // }, 3000);
    // console.log(this.dateWiseData);
  }

  updateValues(country: string){
    console.log(country);
    this.globalData.forEach(cs => {
      if (cs.country === country){
        this.totalConfirmed = cs.confirmed;
        this.totalActive = cs.active;
        this.totalDeaths = cs.deaths;
        this.totalRecovered = cs.recovered;
      }
    });
    this.selectedCountryData = this.dateWiseData[country];
    this.updatechart();
    // console.log(this.selectedCountryData);
  }

  updatechart(){
    let dataTable = [];
    dataTable.push(['Date', 'Cases']);
    this.selectedCountryData.forEach(cs => {
      dataTable.push([cs.date, cs.cases]);
    });
    console.log("dataTable:", dataTable);

    this.lineChart = {
      chartType: 'LineChart',
      dataTable: dataTable,
      options: {
        height: 450,
        animation: {
          duration: 1000,
          easing: 'out'
        }
      },
    };
  }

}
