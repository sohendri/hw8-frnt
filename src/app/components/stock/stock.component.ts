import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SingleStock } from 'src/app/singleStock';
import { StockNews } from 'src/app/stockNews';
import * as Highcharts from 'highcharts';
import { ActivatedRoute, Router } from '@angular/router';
import { Stocks } from 'src/app/stocks';

declare var window: any;

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {

  // Landing
  data1: any = [];

  url1: any = "https://my-project-345719.uc.r.appspot.com/stocks/";
  symbol: string = "";


  // Stock
  active = 1;
  status: boolean = false;
  formModalBuy: any;
  formModalSell: any;
  formModalNews: any;
  stockData: any;
  stockPrice: any;
  stockPeers: any;
  stockUpdate: any;
  stockSentiment: any;
  marketOpen: boolean = true;
  stockPriceUp: boolean = true;
  stockTimeStamp: any;
  currentDate = new Date();
  portfolioStock: any;
  totalQuantity: any;
  totalCost: any;

  addRemoveTicker: string = '';
  found: any;

  status2: boolean = false;
  status3: boolean = true;

  stockAllNews: any;

  localBalance: number = +(localStorage.getItem('balance') || '{}');
  localWatchlist: any = JSON.parse(localStorage.getItem('watchList') || '{}');
  localPortfolio: any = JSON.parse(localStorage.getItem('portfolio') || '{}');

  total: number = 0;

  newsSource: any;
  newsDatetime: any;
  newsHeadline: any;
  newsSummary: any;
  newsUrl: any;

  buyDisabled: boolean = true;

  highcharts = Highcharts;
  chartOptions = {};

  highchartsSMA = Highcharts;
  chartOptionsSMA = {};

  highchartsRec = Highcharts;
  chartOptionsRec = {};

  highchartsSur = Highcharts;
  chartOptionsSur = {};


  constructor(private httpClient: HttpClient, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.stockSelected = this.route.snapshot.paramMap.get('ticker');

    this.formModalBuy = new window.bootstrap.Modal(
      document.getElementById("buyModal")
    )

    this.formModalNews = new window.bootstrap.Modal(
      document.getElementById("newsModal")
    )

    this.formModalSell = new window.bootstrap.Modal(
      document.getElementById("sellModal")
    )

    this.getStockInfo(this.stockSelected).subscribe(data => {
      console.log("Stock Data", data);
      this.stockData = data[0];
      this.stockPrice = data[1];
      this.stockPeers = data[2];
      this.stockUpdate = data[3];
      this.stockSentiment = data[4];
      console.log(this.stockSentiment.twitter[0].mention);

      this.chartOptions = {
        chart: {
          type: "line"
        },
        title: {
          text: this.stockData.ticker + " Ho1y price variation"
        },
        xAxis: {
          categories: new Date(this.stockUpdate.t * 1000).getHours()
        },
        yAxis: {
        },
        series: [
          {
            name: 'Hours',
            data: this.stockUpdate.c
          }
        ]
      };

      // Positive/Negative price
      if (data[0].d >= 0) {
        this.stockPriceUp = true;
      } else {
        this.stockPriceUp = false;
      }
      // Market closed
      if ((this.currentDate.getTime() - data[1].t) >= 60) {
        this.marketOpen = false;
      } else {
        this.marketOpen = true;
      }

      this.getStockSMA();
      this.getStockRecommendation();
      this.getStockSurprises();

    });

    this.getStockNews(this.stockSelected).subscribe(data => {
      this.stockAllNews = data;
      console.log(this.stockAllNews);
    });

    // Check balance of local user
    console.log(this.localBalance);

    // this.localWatchlist.push("GOOGL");
    console.log("Watchlist: " + this.localWatchlist);
  }

  data: any = [];

  url: any = "https://my-project-345719.uc.r.appspot.com/stock/";

  urlNews: any = "https://my-project-345719.uc.r.appspot.com/news/"

  // @Input() stockSelected: any;

  stockSelected: any;

  redirectTo(stock: string) {
    this.router.navigate(['/search', stock]);
  }

  getStockInfo(tkr: string): Observable<SingleStock[]> {
    tkr = this.stockSelected;
    return this.httpClient.get<SingleStock[]>(this.url + tkr);
  }

  getStockNews(tkr: string): Observable<StockNews[]> {
    tkr = this.stockSelected;
    return this.httpClient.get<StockNews[]>(this.urlNews + tkr);
  }

  clickEvent() {
    this.status = !this.status;
    this.portfolioStock = {
      name: this.stockData.ticker,
      quantity: this.totalQuantity,
      cost: this.totalCost
    }
    this.closeModalBuy();
    this.closeModalSell();
    this.localPortfolio.push(this.portfolioStock);
    localStorage.setItem("portfolio", JSON.stringify(this.localPortfolio));
  }

  openModalBuy() {
    this.formModalBuy.show();
  }

  closeModalBuy() {
    this.formModalBuy.hide();
  }

  openModalSell() {
    this.formModalSell.show();
  }

  closeModalSell() {
    this.formModalSell.hide();
  }

  getValue(e: any) {
    setTimeout(() => {
      this.totalQuantity = e.srcElement.value;
      this.total = this.stockPrice.c * this.totalQuantity;
      this.totalCost = this.total;
      if (this.localBalance - this.total > 0 && e.srcElement.value > 0) {
        console.log("Buyable");
        this.buyDisabled = false;
      } else {
        console.log("Not Buyable");
        this.buyDisabled = true;
      }
      localStorage.setItem('balance', JSON.stringify(this.localBalance - this.total));
    }, 100);

  }

  addOrRemoveFromWatchlist(e: any) {
    this.status2 = !this.status2;
    this.status3 = false;
    this.addRemoveTicker = e.path[1].firstChild.innerText;
    console.log(this.addRemoveTicker);
    setTimeout(() => {
      this.found = this.localWatchlist.find((element: any) => element = this.addRemoveTicker);
    }, 100);
    console.log("Before: ", this.localWatchlist);
    if (this.found != undefined) {
      console.log(this.found + " found. Deleting");
      for (var i = 0; i < this.localWatchlist.length; i++) {
        if (this.localWatchlist[i] === this.found) {
          this.localWatchlist.splice(i, 1);
        }
        console.log("After remove: ", this.localWatchlist);
      }
    } else {
      this.localWatchlist.push(this.addRemoveTicker);
      console.log("After: ", this.localWatchlist);
    }
    localStorage.setItem('watchList', JSON.stringify(this.localWatchlist));
  }

  getStockSMA() {
    this.chartOptionsSMA = {
      chart: {
        type: 'bar'
      },
      title: {
        text: this.stockData.ticker + " Historical"
      },
      xAxis: {
        categories: []
      },
      yAxis: {
        min: 0,
        labels: {
          overflow: 'justify'
        }
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true
          }
        },
        series: {
          stacking: 'normal'
        }
      },
      credits: {
        enabled: false
      },
      series: [
        {
          data: this.stockUpdate.c
        },
        {
          data: this.stockUpdate.h
        },
        {
          data: this.stockUpdate.v
        }
      ]
    };
  }

  getStockRecommendation() {
    this.chartOptionsRec = {
      chart: {
        type: 'column'
      },
      title: {
        text: this.stockData.ticker + " Recommendation"
      },
      xAxis: {
        categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Total fruit consumption'
        },
        stackLabels: {
          enabled: true,
          style: {
            fontWeight: 'bold',
            color: 'gray'
          }
        }
      },
      legend: {
        align: 'right',
        x: -30,
        verticalAlign: 'top',
        y: 25,
        floating: true,
        backgroundColor:
          'white',
        borderColor: '#CCC',
        borderWidth: 1,
        shadow: false
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true
          }
        }
      },
      series: [{
        name: '2022-02',
        data: [this.getNumber(), this.getNumber(), this.getNumber(), this.getNumber(), this.getNumber()]
      }, {
        name: '2022-01',
        data: [this.getNumber(), this.getNumber(), this.getNumber(), this.getNumber(), this.getNumber()]

      }, {
        name: '2021-12',
        data: [this.getNumber(), this.getNumber(), this.getNumber(), this.getNumber(), this.getNumber()]

      }, {
        name: '2021-11',
        data: [this.getNumber(), this.getNumber(), this.getNumber(), this.getNumber(), this.getNumber()]

      }]
    };
  }

  getStockSurprises() {
    this.chartOptionsSur = {
      chart: {
        type: 'spline',
        inverted: true
      },
      title: {
        text: 'Historical EPS Surprises'
      },
      xAxis: {
        reversed: false,
        title: {
          enabled: true,
          text: 'Historical EPS Surprises'
        },
        maxPadding: 0.05,
        showLastLabel: true
      },
      yAxis: {
        title: {
          text: ''
        },
        lineWidth: 2
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        spline: {
          marker: {
            enable: false
          }
        }
      },
      series: [{
        name: '',
        data: [[this.getNumber() + this.stockPrice.c, 1], [this.getNumber() + this.stockPrice.c, 2], [this.getNumber() + this.stockPrice.c, 3], [this.getNumber() + this.stockPrice.c, 4], [this.getNumber() + this.stockPrice.c, 5]]
      }]
    };
  }

  getNumber() {
    return (Math.floor(Math.random() * 5) + 1);
  }

  refresh(stock: any) {
    this.stockSelected = stock;
    this.ngOnInit();
  }

  selectNews(news: any) {
    this.newsSource = news.source;
    this.newsDatetime = news.datetime;
    this.newsHeadline = news.headline;
    this.newsSummary = news.summary;
    this.newsUrl = news.url;
    setTimeout(() => {
      this.openModalNews();
    }, 1000);
  }

  openModalNews() {
    this.formModalNews.show();
  }

  closeModalNews() {
    this.formModalNews.hide();
  }



  // Landing component

  getInfo(stc: string): Observable<Stocks[]> {
    return this.httpClient.get<Stocks[]>(this.url1 + stc);
  }

  searchStock(e: any) {
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
    this.router.navigate(['/search', stock.symbol]);
  }
}
