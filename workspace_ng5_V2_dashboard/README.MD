# Insights / Vision Dashboard - Smart by GEP 2.0
### Starting Skeleton
---
## Build Pipeline Status

| Analytics Web-Container | Analytics-CI | Analytics Microservice | Analytics DB-CI | Analytics-ETL-DW-DB-CI  
| ------------- | ------------- | ------------- |  ------------- | ------------- |  
| [![Build Status](https://gepdev.visualstudio.com/GEP-SMART-Analytics/_apis/build/status/GEP-SMART-Analytics-Container?branchName=DEVELOPMENT)](https://gepdev.visualstudio.com/GEP-SMART-Analytics/_build/latest?definitionId=147&branchName=DEVELOPMENT) | [![Build Status](https://gepdev.visualstudio.com/GEP-SMART-Analytics/_apis/build/status/GEP-SMART-Analytics-CI?branchName=DEVELOPMENT)](https://gepdev.visualstudio.com/GEP-SMART-Analytics/_build/latest?definitionId=375&branchName=DEVELOPMENT)  | [![Build Status](https://gepdev.visualstudio.com/GEP-SMART-Analytics/_apis/build/status/GEP-SMART-Analytics-Microservice?branchName=DEVELOPMENT)](https://gepdev.visualstudio.com/GEP-SMART-Analytics/_build/latest?definitionId=155&branchName=DEVELOPMENT) | [![Build Status](https://gepdev.visualstudio.com/GEP-SMART-Analytics/_apis/build/status/GEP-SMART-Analytics-DB-CI?branchName=DEVELOPMENT)](https://gepdev.visualstudio.com/GEP-SMART-Analytics/_build/latest?definitionId=264&branchName=DEVELOPMENT) | [![Build Status](https://gepdev.visualstudio.com/GEP-SMART-Analytics/_apis/build/status/SmartAnalytics-ETL-DW-DB-CI?branchName=DEVELOPMENT)](https://gepdev.visualstudio.com/GEP-SMART-Analytics/_build/latest?definitionId=274&branchName=DEVELOPMENT) |  


| SmartAnalytics-ETL-DB-CI | Data.Entities-NuGet |Administration.Entities-NuGet |MetaData.Entities-NuGet
| ------------- | ------------- | ------------- | ------------- |
|[![Build Status](https://gepdev.visualstudio.com/GEP-SMART-Analytics/_apis/build/status/SmartAnalytics-ETL-DB-CI?branchName=DEVELOPMENT)](https://gepdev.visualstudio.com/GEP-SMART-Analytics/_build/latest?definitionId=273&branchName=DEVELOPMENT) | [![Build Status](https://gepdev.visualstudio.com/GEP-SMART-Analytics/_apis/build/status/NuGet/GEP.Cumulus.SmartAnalytics.Data.Entities-NuGet?branchName=DEVELOPMENT)](https://gepdev.visualstudio.com/GEP-SMART-Analytics/_build/latest?definitionId=512&branchName=DEVELOPMENT) | [![Build Status](https://gepdev.visualstudio.com/GEP-SMART-Analytics/_apis/build/status/NuGet/GEP.Cumulus.SmartAnalytics.Administration.Entities-NuGet?branchName=DEVELOPMENT)](https://gepdev.visualstudio.com/GEP-SMART-Analytics/_build/latest?definitionId=499&branchName=DEVELOPMENT) | [![Build Status](https://gepdev.visualstudio.com/GEP-SMART-Analytics/_apis/build/status/NuGet/GEP.Cumulus.SmartAnalytics.MetaData.Entities-NuGet?branchName=DEVELOPMENT)](https://gepdev.visualstudio.com/GEP-SMART-Analytics/_build/latest?definitionId=513&branchName=DEVELOPMENT) |

## Development Software Requirement
    1. Microsoft Visual Studio 2015/2017
    2. Microsoft SQL Server 2008/2014
    3. Github Desktop Setup and Portal Access
    4. Microsoft Azure SDK (2.9.5) Emulator.
    5. Microsoft Azure Service Fabric SDK (3.0.456) & Microsoft Azure Service Fabric (6.1.456) (Microservices).
    6. VS Code
    7. Node JS

## Dependencies by GEP
Please be aware this is a starting boilerplate template, I've included the minimal dependencies, but remember npm packages in gallery, can be 
easily integrated to this framework.

    smart-assets, smart-autocomplete, smart-autosuggest, smart-button, smart-card2, smart-cards-manager, smart-cards-shared, smart-category, smart-checkbox, smart-comment, smart-date, smart-daterangepicker,smart-drag-drop-upload, smart-dropdown, smart-element, smart-form-builder, smart-form-widget, smart-global-loader,smart-gridstack-layout, smart-gridstack-placeholder, smart-header, smart-iframe-popup, smart-line-details, smart-lite-table, smart-notification, smart-numeric,smart-platform-services, smart-radio, smart-search, smart-section, smart-select, smart-selectall, smart-sliding-menu, smart-sticky-header,smart-subtree-accordion, smart-table, smart-textarea, smart-textfield
    smart-toast, smart-tooltip

## Microservice
    Replace the `ConfigSqlConn` and  `DataCacheConn` with local development key adnd change the  PlacementConstraints off in ServiceManifest.xml file 

## Development Server

1. Old Dashboard
 
     1. For the development server, we have wrapped everything around `webpack-dev-server` to initialize the localhost please go ahead and Run `npm run startDashboardDev`. 

    2. Please be-aware the file `/webpackConfig/webpack.dev.js` Navigate to line #12, and comment this line, in order to run `http://127.0.0.1:81/` (Azure emulator hosted address ). The app will automatically reload if you change any of the source files.

    Note: If your pushing this project to the git to be hosted outside, please make sure line #12 it's not hidden.   

2. New Dashboard
    1. For the development server, we have wrapped everything around `webpack-dev-server` to initialize the localhost please go ahead and Run `npm start`. 

    2. Please be-aware the file `/webpackConfig/webpack.local.js` Navigate to line #12, and comment this line, in order to run `http://localhost:3000/`. The app will automatically reload if you change any of the source files.

    3. Please change the publicPath in webpack of dev.js and prod.js files for the debugging the local code to IIS hosted path eg. http://localhost/gepdevmtstorage/smartcontent/distribution/__buildVersion___dashboard__V2/

    Note: If your pushing this project to the git to be hosted outside, please make sure line #12 it's not hidden.

## Production Server

1. Old Dashboard  : For the production server, we have wrapped everything around `webpack` to initialize the localhost please go ahead and Run `npm start buildDashboard`.

2. New Dashboard  : For the production server, we have wrapped everything around `webpack` to initialize the localhost please go ahead and Run `npm start buildDV2`.

## Static Configurations

Please be-aware if you do not have api's ready to start building your Feature story, Make usage of `mockData.js` or `config.js` through smart platform services which then will be consume by Document Owners through Resolver Data, from router paths.

## Front End Styling (WIP)

Needs refactoring by CodeOwner of CSS. This is very bad CSS copied and pasted unproperly.

## Debugging Through VCode

Debugging through VCode already implementented, feel free to use Debug > Start Debugging.

## Unit Testing

Unit Testing
