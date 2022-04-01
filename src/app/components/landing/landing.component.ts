
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Stocks } from '../../stocks';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})


export class LandingComponent implements OnInit {

  data: any = [];

  url: any = "https://my-project-345719.uc.r.appspot.com/stocks/";

  stockSelected: string = "";
  symbol: string = "";

  constructor(private httpClient: HttpClient, private router: Router) { }

  ngOnInit(): void {
  }

  getInfo(stc: string): Observable<Stocks[]> {
    return this.httpClient.get<Stocks[]>(this.url + stc);
  }

  searchStock(e: any) {
    // console.log(e.srcElement.value);
    this.getInfo(e.srcElement.value).subscribe(data => {
      console.log(data);
      this.data = data;
    }
    );
  }

  displayFn(subject: any) {
    console.log(subject);
    return subject ? subject : undefined;
  }

  selectStock(stock: any) {
    // this.symbol = e.srcElement.firstChild.textContent;
    // this.stockSelected = this.symbol;
    this.router.navigate(['/search', stock.symbol]);
  }
}
