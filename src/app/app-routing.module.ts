import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { BuyComponent } from './modals/buy/buy.component';
import { SellComponent } from './modals/sell/sell.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { WatchlistComponent } from './components/watchlist/watchlist.component';
import { StockComponent } from './components/stock/stock.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'search/home' },
  { path: 'search/home', pathMatch: 'full', component: LandingComponent },
  { path: 'search/:ticker', pathMatch: 'full', component: StockComponent },
  { path: 'watchlist', pathMatch: 'full', component: WatchlistComponent },
  { path: 'portfolio', pathMatch: 'full', component: PortfolioComponent },
  { path: 'buy', pathMatch: 'full', component: BuyComponent },
  { path: 'sell', pathMatch: 'full', component: SellComponent },
  //   { path: 'details/:id', component: CustomerDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
