import { Component, OnInit } from '@angular/core';
import { GoogleChartInterface } from 'ng2-google-charts';
import { GlobalDataSummary } from 'src/app/models/global-data';
import { DataServiceService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  loading = true;
  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  globalData: GlobalDataSummary[];
  pieChart: GoogleChartInterface = {
    chartType: 'PieChart'
  };
  columnChart: GoogleChartInterface = {
    chartType: 'ColumnChart'
  };

  constructor(private dataService: DataServiceService) { }

  ngOnInit(): void {
    this.dataService.getGlobalData().subscribe({
      next: (result) => {
        console.log(result);
        this.globalData = result;
        result.forEach(cs => {
          if (!Number.isNaN(cs.confirmed)){
            this.totalConfirmed += cs.confirmed;
            this.totalActive += cs.active;
            this.totalDeaths += cs.deaths;
            this.totalRecovered += cs.recovered;
          }
        });
        this.initCharts('c');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }


  initCharts(caseType: string){
    let dataTable = [];
    dataTable.push(['Country', 'Cases']);
    // let value: number;
    this.globalData.forEach(cs => {
      let value: number;
      switch (caseType){
        case 'c' :
          if (cs.confirmed > 500000) {
            value = cs.confirmed;
            console.log("caseType c:", caseType);
          }
          break;
        case 'a' :
          if (cs.active > 400000) {
            value = cs.active;
            console.log("caseType a:", caseType);
          }
          break;
        case 'd' :
          if (cs.deaths > 30000) {
            value = cs.deaths;
            console.log("caseType d:", caseType);
          }
          break;
        case 'r' :
          if (cs.recovered > 2000) {
            value = cs.recovered;
            console.log("caseType r:", caseType);
          }
          break;
      }
      console.log('value', value);

      if (value){
        dataTable.push([cs.country, value]);
      }
    });
    // console.log(dataTable);

    this.pieChart = {
      chartType: 'PieChart',
      // tslint:disable-next-line:object-literal-shorthand
      dataTable: dataTable,
      options: {
        height: 450,
        animation: {
          duration: 1000,
          easing: 'out'
        }
      },
    };

    this.columnChart = {
      chartType: 'ColumnChart',
      // tslint:disable-next-line:object-literal-shorthand
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

  updateCharts(input: HTMLInputElement){
    console.log("input.value:", input.value);
    this.initCharts(input.value);
  }

}
