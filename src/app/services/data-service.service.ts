import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { count, map } from 'rxjs/operators';
import { DateWiseData } from '../models/date-wise-data';
import { GlobalDataSummary } from '../models/global-data';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  private globalDataUrl = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/12-31-2020.csv`;
  private dateWiseDataUrl = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv`;
  constructor(private http: HttpClient) { }

  getDateWiseData(){
    return this.http.get(this.dateWiseDataUrl, {responseType: 'text'})
      .pipe(map(result => {
        let rows = result.split('\n');
        // console.log(rows);
        let mainData = {};
        let header = rows[0];
        let dates = header.split(/,(?=\S)/);
        dates.splice(0, 4);
        rows.splice(0, 1);
        rows.forEach(row => {
          let cols = row.split(/,(?=\S)/);
          let country = cols[1];
          cols.splice(0, 4);
          // console.log(country, cols);
          mainData[country] = [];
          cols.forEach((value, index) => {
            let dateWiseData: DateWiseData = {
              cases : +value,
              country: country,
              date: new Date(Date.parse(dates[index]))
            };
            mainData[country].push(dateWiseData);
          });
        });
        // console.log("mainData:", mainData);
        return mainData;
      }));
  }

  getGlobalData(){
    return this.http.get(this.globalDataUrl, {responseType: 'text'}).pipe(
      map(result => {
        let data: GlobalDataSummary[] = [];
        let raw = {};
        let rows = result.split('\n');
        rows.splice(0, 1);
        // console.log(rows);
        rows.forEach(row => {
          let cols = row.split(/,(?=\S)/);
          let cs = {
            country: cols[3],
            confirmed: +cols[7],
            deaths: +cols[8],
            recovered: +cols[9],
            active: +cols[10]
          };
          let temp : GlobalDataSummary = raw[cs.country];
          if (temp){
            temp.active = cs.active + temp.active;
            temp.confirmed = cs.confirmed + temp.confirmed;
            temp.deaths = cs.deaths + temp.deaths;
            temp.recovered = cs.recovered + temp.recovered;
            raw[cs.country] = temp;
          } else {
            raw[cs.country] = cs;
          }

          // data.push({
          //   country: cols[3],
          //   confirmed: cols[7],
          //   deaths: cols[8],
          //   recovered: cols[9],
          //   active: cols[10]
          // });
        });
        // console.log(raw);

        return Object.values(raw) as GlobalDataSummary[];
      })
    );
  }

}
