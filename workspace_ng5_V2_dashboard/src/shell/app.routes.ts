import { Routes } from "@angular/router";
import { HeaderContComponent } from "../app/header/header.component";
// import { ProxyComponent } from "app/proxy-component/proxy.compon ent";
// import { ProxyComponent as GlobalFilterProxyComponent } from "../app/global-filter/proxy.component";
import { GlobalFilterComponent } from "../app/global-filter/global-filter.component";
import { GlobalFilterResolverService } from "../app/global-filter/global-filter-resolver.service"

export const dashboardRoute: Routes =
  [
    {
      path: 'oppfinder',
      component: HeaderContComponent,
      children: [
        {
          path: '',
          loadChildren:
            "../../src/app/oppfinder-wrapper/oppfinder-wrapper.module#OppFinderWrapperModule"
        }
      ]
    },
    {
      path: 'fraudAnomaly',
      component: HeaderContComponent,
      children: [
        {
          path: '',
          loadChildren:
          "../../src/app/fraudAnomaly-wrapper/fraudAnomaly-wrapper.module#FraudAnomalyWrapperModule"        }
      ]
    },
    {
      path: 'dashboard',
      component: HeaderContComponent,
      children: [
        {
          path: '',
          loadChildren:
            "../../src/app/dashboard-grid-wrapper/dashboard-grid-wrapper.module#DashboardGridWrapperModule"
        }
      ]
    },
    { path: '**', redirectTo: '/dashboard', pathMatch: 'full' }
 
  ];
