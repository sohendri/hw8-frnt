import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SingleStock } from 'src/app/singleStock';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit {

  balance: number = +(localStorage.getItem('balance') || '{}');
  watchList: any = JSON.parse(localStorage.getItem('watchList') || '{}');

  watchListArr: any = [];

  noStock: boolean = true;

  found: string = "";

  url: any = "https://my-project-345719.uc.r.appspot.com/watchlistStock/";

  constructor(private httpClient: HttpClient, private router: Router) { }

  ngOnInit(): void {
    console.log("Local WatchList", this.watchList);
    setTimeout(() => {
    }, 1000);
    this.getAllWatchList();

    console.log(this.watchList.length);
    setInterval(() => {
      if (this.watchList.length == 0) {
        this.noStock = false;
      } else {
        this.noStock = true;
      }
    }, 100)
  }

  getAllWatchList = async () => {
    await this.watchList.forEach((element: any) => {
      this.getStockInfo(element).subscribe(data => {
        this.watchListArr.push(data);
      });
    });
  }

  getStockInfo(tkr: string): Observable<SingleStock[]> {
    return this.httpClient.get<SingleStock[]>(this.url + tkr);
  }

  deleteItem(e: any) {
    e.path[2].style.display = "none";
    let itemToRemove = e.path[2].children[0].firstChild.innerText;
    setTimeout(() => {
      this.found = this.watchList.find((element: any) => element = itemToRemove);
      if (this.found != undefined) {
        for (var i = 0; i < this.watchList.length; i++) {
          if (this.watchList[i] === this.found) {
            this.watchList.splice(i, 1);
          }
          localStorage.setItem('watchList', JSON.stringify(this.watchList));
        }
      }
    }, 100);
  }

  selectStock(stock: any) {
    this.router.navigate(['/search', stock[0].ticker]);
  }
}
