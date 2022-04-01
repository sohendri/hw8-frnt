import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SingleStock } from 'src/app/singleStock';

declare var window: any;

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {

  balance: number = +(localStorage.getItem('balance') || '{}');
  portfolio: any = JSON.parse(localStorage.getItem('portfolio') || '{}');

  portfolioArr: any = [];
  portfolioEmpty: boolean = true;

  formModal: any;
  formModal2: any;

  url: any = "https://my-project-345719.uc.r.appspot.com/watchlistStock/";
  buyingStockTicker: any;
  buyingStockArr: SingleStock[] = [];
  totalQuantity: number = 0;
  total: number = 0;
  totalCost: number = 0;
  buyDisabled: boolean = true;
  sellDisabled: boolean = true;
  showBought: boolean = false;
  showSold: boolean = false;
  stockQty: any;
  // found: any;

  constructor(private httpClient: HttpClient, private activatedRoute: ActivatedRoute, private r: Router) {
  }

  ngOnInit(): void {
    this.formModal = new window.bootstrap.Modal(
      document.getElementById("sellModalPF")
    )
    this.formModal2 = new window.bootstrap.Modal(
      document.getElementById("buyModalPF")
    )

    this.getPortfolioStocks();

    setInterval(() => {
      if (this.portfolio.length != 0) {
        this.portfolioEmpty = false
      } else {
        this.portfolioEmpty = true;
      }
    }, 100);
  }

  getPortfolioStocks = async () => {
    await this.portfolio.forEach((element: any) => {
      this.getStockInfo(element.name).subscribe(data => {
        data[2] = element.quantity;
        data[3] = element.cost;
        this.portfolioArr.push(data);
      });
    });
    console.log(this.portfolioArr);
  }

  getStockInfo(tkr: string): Observable<SingleStock[]> {
    return this.httpClient.get<SingleStock[]>(this.url + tkr);
  }

  getValueBuy(e: any) {
    setTimeout(() => {
      this.totalQuantity = e.srcElement.value;
      console.log(this.buyingStockArr[1]);
      this.total = this.buyingStockArr[1].c * this.totalQuantity;
      this.totalCost = this.total;
      if (this.balance - this.total > 0 && e.srcElement.value > 0) {
        this.buyDisabled = false;
      } else {
        this.buyDisabled = true;
      }
      localStorage.setItem('balance', JSON.stringify(this.balance - this.total));
      this.r.navigateByUrl('/portfolio');
    }, 100);
  }

  buyStock(e: any) {
    console.log(e);
    this.portfolio.forEach((element: any, index: number) => {
      if (element.name === this.buyingStockArr[0].ticker) {
        this.portfolio[index] = {
          name: this.buyingStockArr[0].ticker,
          quantity: +(this.portfolio[index].quantity) + +(this.totalQuantity),
          cost: +(this.portfolio[index].cost) + +(this.totalCost)
        };
        console.log(this.portfolio);
        localStorage.setItem('portfolio', JSON.stringify(this.portfolio));
        this.closeModal2();
      }
    });
    this.showBought = true;
    setTimeout(() => {
      this.showBought = false;
    }, 1500);
  }

  getValueSell(e: any) {
    setTimeout(() => {
      this.totalQuantity = e.srcElement.value;
      console.log(this.buyingStockArr[1]);
      this.total = this.buyingStockArr[1].c * this.totalQuantity;
      this.totalCost = this.total;
      if (this.balance - this.total > 0 && e.srcElement.value > 0 && e.srcElement.value <= this.stockQty) {
        this.sellDisabled = false;
      } else {
        this.sellDisabled = true;
      }
      localStorage.setItem('balance', JSON.stringify(this.balance - this.total));
    }, 100);
  }

  sellStock(e: any) {
    console.log(e);
    this.portfolio.forEach((element: any, index: number) => {
      if (element.name === this.buyingStockArr[0].ticker) {
        this.portfolio[index] = {
          name: this.buyingStockArr[0].ticker,
          quantity: +(this.portfolio[index].quantity) - +(this.totalQuantity),
          cost: +(this.portfolio[index].cost) - +(this.totalCost)
        };
        console.log(this.portfolio);
        localStorage.setItem('portfolio', JSON.stringify(this.portfolio));
        this.closeModal();
      }
    });
    this.showSold = true;
    setTimeout(() => {
      this.showSold = false;
    }, 1500);
  }

  openModal(e: any, stock: any) {
    this.stockQty = stock;
    this.buyingStockTicker = e.path[2].children[0].children[0].firstChild.innerText;
    this.getStockInfo(this.buyingStockTicker).subscribe(data => {
      console.log("Modal data: ", data);
      this.buyingStockArr = data;
    })
    this.formModal.show();
  }

  closeModal() {
    this.formModal.hide();
  }

  openModal2(e: any) {
    this.buyingStockTicker = e.path[2].children[0].children[0].firstChild.innerText;
    this.getStockInfo(this.buyingStockTicker).subscribe(data => {
      console.log("Modal data: ", data);
      this.buyingStockArr = data;
    })
    this.formModal2.show();
  }

  closeModal2() {
    this.formModal2.hide();
  }

}
