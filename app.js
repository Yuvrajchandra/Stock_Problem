const express = require("express");
const request= require("request");
const https= require("https");
const CSVtoJSON = require("csvtojson");
const Filesystem= require("fs");
const _ = require("lodash");

const app= express();


app.get("/", function(req,res){
  const url= "https://sheet.best/api/sheets/c4004fdb-71a4-479c-866f-9f810072a9b3?X-Api-Key=YX%d6$7waWCQ%23G6u8$@BlC%WQ!WPJAGsy3_vl4N9XB7C9Mo23cP56Jl!HZrQhsW6";


  var stocks={};
  https.get(url, function(response){
  console.log("Status Code for get request: " + response.statusCode);


    response.on("data", function(data){
      stocks= data;
      const stockData = JSON.parse(data);
      stocks= JSON.parse(data);
      var tickers= [];              //Array to store Ticker names
      var purchasePrices = [];      //Array to store individual ticker purchase prices
      var i;


      for(i=0; i<stockData.length; i++){
        tickers.push(stockData[i].ticker);
        purchasePrices.push(parseInt(stockData[i].purchasePrice));
      };



      console.log(stockData);

      stocks = _.cloneDeep(stockData);


    });
  });

  //------------------------------------CALCULATION OF AVERAGE PRICE FOR EACH TICKER--------------------------------------------
  //SOURCE: YAHOO FINANCE

  var averagePrices=[];
  //===================MICROSOFT=====================

  CSVtoJSON().fromFile("./MSFT.csv").then(microsoft=> {
    var m;
    var total1=0;
    var count1=0;
    for(m=0; m<microsoft.length; m++){
      total1 += parseInt(microsoft[m].Close);
      count1++;
    }
    var averageMSFT= total1/count1;
    averagePrices.push(averageMSFT);
    console.log("Average 1 month closing price for microsoft: "+ averageMSFT);
  });

  //====================HUBSPOT========================

  CSVtoJSON().fromFile("./HUBS.csv").then(hubspot=> {
    var h;
    var total2=0;
    var count2=0;
    for(h=0; h<hubspot.length; h++){
      total2 += parseInt(hubspot[h].Close);
      count2++;
    }
    var averageHUBS= total2/count2;
    averagePrices.push(averageHUBS);
    console.log("Average 1 month closing price for hubspot: "+ averageHUBS);
  });

//====================SALESFORCE========================

  CSVtoJSON().fromFile("./CRM.csv").then(salesforce=> {
    var s;
    var total3=0;
    var count3=0;
    for(s=0; s<salesforce.length; s++){
      total3 += parseInt(salesforce[s].Close);
      count3++;
    }
    var averageCRM= total3/count3;
    averagePrices.push(averageCRM);
    console.log("Average 1 month closing price for salesforce: "+ averageCRM);
  });


  //=====================SLACK=============================


  CSVtoJSON().fromFile("./WORK.csv").then(slack=> {
    var sl;
    var total4=0;
    var count4=0;
    for(sl=0; sl<slack.length; sl++){
      total4 += parseInt(slack[sl].Close);
      count4++;
    }
    var averageWORK= total4/count4;
    averagePrices.push(averageWORK);
    console.log("Average 1 month closing price for slack technologies: "+ averageWORK);
  });


//===========================GOOGLE==========================

  CSVtoJSON().fromFile("./GOOGL.csv").then(google=> {
    var g;
    var total5=0;
    var count5=0;
    for(g=0; g<google.length; g++){
      total5 += parseInt(google[g].Close);
      count5++;
    }
    var averageGOOGL= total5/count5;
    averagePrices.push(averageGOOGL);
    console.log("Average 1 month closing price for google: "+ averageGOOGL);
  });


// --------------------------------------------------POST REQUEST---------------------------------------------------------


  const jsondata=[];
  var d;
  var j;
  let individualData;
  for(j=0; j<stocks.length; j++){
    if(parseInt(stocks[j].purchasePrice) > averagePrices[j]){
      d = Date(Date.now());
      individualData={
        name: "XYZ",
        ticker: tickers[j],
        purchasePrice: purchasePrices[j],
        average: averagePrices[j],
        shouldSell: "true",
        createdAt: d
      }
    } else {
      d = Date(Date.now());
      individualData={
        name: "ABC",
        ticker: tickers[j],
        purchasePrice: purchasePrices[j],
        average: averagePrices[j],
        shouldSell: "false",
        createdAt: d
      }
    }

    jsondata.push(individualData);

  }

  const data = JSON.stringify(jsondata);

  let options = {
    method: 'POST',
    url: "https://sheet.best/api/sheets/fec49be9-d3f0-4a08-bc38-5104ef9a2faf",
    headers: {
              'Content-Type': 'application/json'

             },

    auth:    {
              'Authorization': 'X-Api-Key F5%wnQP97E6ffD_RVzef!!3z-C@ue#uU#%RO0masY_uYPIM3R10$m2Ebrl0qKSPI'
             },

    json: "true"

  };


  const request = https.request(options, function(response){

    console.log(response.statusCode);

    response.on("data", function(data){
    console.log(JSON.parse(data));
    });
  });

  request.write(data);
  request.end();


});



app.listen(3000, function(){
  console.log("Server is running at port 3000");
});
