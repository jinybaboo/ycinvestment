import { RiContrastDropLine } from "react-icons/ri";
import colors from "./colors";
import * as commonFunc from "./commonFunc";

const markerOptions = {
  enabled:false, 
  symbol:'circle',
  states:{
    hover:{
      radius:1.5,
      lineWidth:0,
      fillColor:colors.black,
      enabled: false // 호버 상태에서 마커 표시 안 함 (크로스라인의 점표시)
    },
  }
};

export function getCandleSeries(candleArr, dataName){
  let decimalNum = 0;
  if(dataName.includes('BOND') || dataName=='DOLLAR_INDEX'|| dataName=='USD_KRW'|| dataName=='EUR_USD'|| dataName=='USD_JPY'|| dataName=='USD_CNY'){
    decimalNum=2;
  }

  //캔들 시리즈
  const result = {
    type: 'candlestick',
    name: dataName,
    id: 'mainCandle',
    data: candleArr,
    yAxis: 0,
    upColor: '#FFFFFF', // 양봉 색상
    upLineColor:'red', // 양봉선 색상
    color:"#FFFFFF", // 음봉 색상
    lineColor:"blue", //음봉선 색상
    showInLegend : false,

    tooltip: {
      distance:180,
      pointFormatter: function() {
        const date = commonFunc.getFromDateTypeToString(new Date(this.x)).substring(0,7);

        //다른 시리즈의 값 및 태그
        const { x } = this; // 현재 시리즈의 x값 가져오기
        const seriesAll = this.series.chart.series;
        //console.log(seriesAll)
        let tag =`<div style="color:blue; line-height:20px;"><b>&nbsp;${date}</b></div><br>`;
        seriesAll.forEach((item, idx)=>{
          const name = item.name;
          // console.log(name)
          if(name==='3MA'||name==='12MA'||name==='20MA'||name==='60MA'||name==='120MA'
           ||name==='1차저항'||name==='2차저항'||name==='3차저항'
           ||name==='1차지지'||name==='2차지지'||name==='3차지지'
          ){
            const xIdx = item.xData.indexOf(x);
            const yVal = item.yData[xIdx]===undefined?'N/A': commonFunc.thousandComma(commonFunc.decimalRound(item.yData[xIdx],decimalNum));
            
            const color = item.color;
            tag+=`<span style="color:${color}" >\u25CF</span> ${name} :  <b>${yVal}</b><br>`
            if(name==='120M'){tag+='<br>'}
            
          }
        })

       

        //캔들 시리즈의 값 및 태그
        const open = commonFunc.thousandComma(commonFunc.decimalRound(this.open,decimalNum));
        const high = commonFunc.thousandComma(commonFunc.decimalRound(this.high,decimalNum));
        const low = commonFunc.thousandComma(commonFunc.decimalRound(this.low,decimalNum));
        const close = commonFunc.thousandComma(commonFunc.decimalRound(this.close,decimalNum));
        let finalTag = 
          tag +
          ` <br>
            시 : <b>${open}</b><br>
            고 : <b>${high}</b><br>
            저 : <b>${low}</b><br>
            종 : <b>${close}</b><br><br>
          `; 
        return finalTag;
      },
    },
  };
  return result;
}


export function getMovingAverageSeries(ma3Arr, ma12Arr, ma20Arr, ma60Arr, ma120Arr, from){
  //console.log(separationUpArr, separationDownArr)

  const result = [];
    const ma3 = {
      type: 'line', name: '3MA', data: ma3Arr, color:colors.ma3, lineWidth:1.5,
      marker : markerOptions,//라인상의 동그란점(마커)제거 및 호버시 마커 액션 설정
      tooltip: {  pointFormatter: function () { return ''; }}, //개별 툴팁 없애기 (캔들에 커스텀 통합)
      legendSymbol:"rectangle",
    };
    const ma12 = {
      type: 'line', name: '12MA', data: ma12Arr, color:colors.ma12, lineWidth:2.5,
      marker : markerOptions,
      tooltip: {  pointFormatter: function () { return ''; }},
      legendSymbol:"rectangle",
    };
    const ma20 = {
      type: 'line', name: '20MA', data: ma20Arr, color:colors.ma20, lineWidth:2.5,
      marker : markerOptions,
      tooltip: {  pointFormatter: function () { return ''; }},
      legendSymbol:"rectangle",
    }
    const ma60 = {
      type: 'line', name: '60MA', data: ma60Arr, color:colors.ma60, lineWidth:2.5,
      marker : markerOptions,
      tooltip: {  pointFormatter: function () { return ''; }},
      legendSymbol:"rectangle",

    }
    const ma120 = {
      type: 'line', name: '120MA', data: ma120Arr, color:colors.ma120, lineWidth:2.5,
      marker : markerOptions,
      tooltip: {  pointFormatter: function () { return ''; }},
      legendSymbol:"rectangle",
    };

    result.push(ma3);
    from==='expand' && result.push(ma12);
    result.push(ma20);
    result.push(ma60);
    from==='expand' && result.push(ma120);
  

  return result;
}


export function getVolumeSeries(volumeArr, volumeColors){
  return {
    type: 'column',
    name: '거래량',
    data: volumeArr,
    yAxis: 1,  //y축 위치
    //color: colors.volume, // 거래량 색상
    colorByPoint: true,  //개별 색상 적용 활성화
    colors: volumeColors, //개별 색상 데이터
    borderRadius:0,
    borderWidth:0,

    tooltip: {
      pointFormatter: function () {
        let val =  commonFunc.thousandComma( commonFunc.decimalRound(this.y*1, 0));
        // return val;
        return '';
      },
    },
    showInLegend : false, // 차트 아래 선택 레전드 없앰
  }
}


export function getVolumeMaSeries(dataArr,name,color, lineWidth){
  return {
    type: 'line',
    name: name,
    data: dataArr,
    // lineWidth:lineWidth,
    yAxis: 1,  //y축 위치
    color: color, //개별 색상 데이터
    marker:{enabled:false},
    tooltip: {
      pointFormatter: function () {
        let val =  commonFunc.thousandComma( commonFunc.decimalRound(this.y*1, 0));
        // return val;
        return '';
      },
    },
    showInLegend : false, // 차트 아래 선택 레전드 없앰

    states:{
      hover:{
        enabled: false  // hover 동작 비활성화 //세로 줄과 차트 접점에서 보이는 포인트 없앰
      }
    }
  }
}

export function getResAndSupSeriesArr(resLine1,resLine2,resLine3,supLine1,supLine2,supLine3,resInfo,supInfo){
  let lastOne;
  let lastDate=0;

  resInfo.forEach((item, idx)=>{
    const date = item.highPriceDate;
    if(lastDate<date){
      lastOne =idx+1+`차저항`;
      lastDate = date;
    }
  });

  supInfo.forEach((item, idx)=>{
    const date = item.lowPriceDate;
    if(lastDate<date){
      lastOne =idx+1+`차지지`;
      lastDate = date;
    }
  });


  const returnArr = [];
  
  if(resLine1.length!==0){
    const lineWidth = lastOne=='1차저항'?2.5:1;
    const dashStyle = lastOne=='1차저항'?'Solid':'Dot';

    returnArr.push({
      type: 'line', name: '1차저항', data: resLine1, color:colors.resistance, showInLegend:true,
      marker : markerOptions,
      tooltip: {  pointFormatter: function () { return ''; }},
      legendSymbol:"rectangle",
      dashStyle:dashStyle,
      lineWidth:lineWidth,
      
    })
  }
  if(resLine2.length!==0){
    const lineWidth = lastOne=='2차저항'?2.5:1;
    const dashStyle = lastOne=='2차저항'?'Solid':'Dash';

    returnArr.push({
      type: 'line', name: '2차저항', data: resLine2, color:colors.resistance, showInLegend:true,
      marker : markerOptions,
      tooltip: {  pointFormatter: function () { return ''; }},
      legendSymbol:"rectangle",
      dashStyle:dashStyle,
      lineWidth:lineWidth,
    })
  }
  if(resLine3.length!==0){
    const lineWidth = lastOne=='3차저항'?2.5:1;
    const dashStyle = 'Solid';
    
    returnArr.push({
      type: 'line', name: '3차저항', data: resLine3, color:colors.resistance, showInLegend:true,
      marker : markerOptions,
      tooltip: {  pointFormatter: function () { return ''; }},
      legendSymbol:"rectangle",
      dashStyle:dashStyle,
      lineWidth:lineWidth,
    })
  }


  if(supLine1.length!==0){
    const lineWidth = lastOne=='1차지지'?2.5:1;
    const dashStyle = lastOne=='1차지지'?'Solid':'Dot';

    returnArr.push({
      type: 'line', name: '1차지지', data: supLine1, color:colors.support, showInLegend:true,
      marker : markerOptions,
      tooltip: {  pointFormatter: function () { return ''; }},
      legendSymbol:"rectangle",
      dashStyle:dashStyle,
      lineWidth:lineWidth,
    })
  }
  if(supLine2.length!==0){
    const lineWidth = lastOne=='2차지지'?2.5:1;
    const dashStyle = lastOne=='2차지지'?'Solid':'Dash';

    returnArr.push({
      type: 'line', name: '2차지지', data: supLine2, color:colors.support, showInLegend:true,
      marker : markerOptions,
      tooltip: {  pointFormatter: function () { return ''; }},
      legendSymbol:"rectangle",
      dashStyle:dashStyle,
      lineWidth:lineWidth,
    })
  }
  if(supLine3.length!==0){
    const lineWidth = lastOne=='3차지지'?2.5:1;
    const dashStyle = 'Solid';

    returnArr.push({
      type: 'line', name: '3차지지', data: supLine3, color:colors.support, showInLegend:true,
      marker : markerOptions,
      tooltip: {  pointFormatter: function () { return ''; }},
      legendSymbol:"rectangle",
      dashStyle:dashStyle,
      lineWidth:lineWidth,
    })
  }
  return returnArr;
}


export function getResFlagAndScatterSeires(resInfo, candleArr){
  const resFlagData = [];
  const resBreakFlagData = [];
  const resScatterData = [];


  resInfo.forEach((item, idx)=>{
    // console.log(item)
    let {highPrice, highPriceDate, breakDate} = item;
    const highPriceDateStr = highPriceDate.toString().substring(0,4)+'-'+highPriceDate.toString().substring(4,6)+'-01';
    const dateShort = highPriceDate.toString().substring(2,4)+'-'+highPriceDate.toString().substring(4,6);
    const highPriceDateTime = new Date(highPriceDateStr).getTime();

    //scatter 차트로 점도 찍어주기
    resScatterData.push({x:highPriceDateTime, y:highPrice});
  });

  const resScatterOption = { // 포인트 찍어줌
    type: 'scatter',
    name: '',
    marker: {
        symbol: 'triangle',
        // symbol: 'circle',
        radius:5,
    },
    data : resScatterData,  //{x:1293840000000, y:200}
    showInLegend : false,
    color:colors.resistance,
    tooltip: {  pointFormatter: function (e,i) { 
      // console.log(this)
      const { x,y, index } = this; // 현재 시리즈의 x값 가져오기
      let date = commonFunc.getFromDateTypeToString(new Date(x));
      date = date.toString().substring(2,7).replace('-','/');
      const yVal = commonFunc.thousandComma( commonFunc.decimalRound(y, 0));
      return `<b>월상${index+1}(${date}) : ${yVal}</b>`; 
    }},

  };

  return {resScatterOption}
}

export function getSupFlagAndScatterSeires(supInfo, candleArr){
  
  const supFlagData = [];
  const supBreakFlagData = [];
  const supScatterData = [];

  supInfo.forEach((item, idx)=>{
    const {lowPrice, lowPriceDate, breakDate} = item
    const lowPriceDateStr = lowPriceDate.toString().substring(0,4)+'-'+lowPriceDate.toString().substring(4,6)+'-01';
    const lowPriceDateTime = new Date(lowPriceDateStr).getTime();

    //scatter 차트로 점도 찍어주기
    supScatterData.push({x:lowPriceDateTime, y:lowPrice});
  })
  
  const supScatterOption = {
    type: 'scatter',
    name: '',
    marker: {
        symbol: 'triangle-down',
        // symbol: 'circle',
        radius:5,
    },
    data : supScatterData,
    showInLegend : false,
    color:colors.support,
    tooltip: {  pointFormatter: function (e,i) { 
      // console.log(this)
      const { x,y, index } = this; // 현재 시리즈의 x값 가져오기
      let date = commonFunc.getFromDateTypeToString(new Date(x));
      date = date.toString().substring(2,7).replace('-','/');
      const yVal = commonFunc.thousandComma( commonFunc.decimalRound(y, 0));
      return `<b>월하${index+1}(${date}) : ${yVal}</b>`; 
    }},
  }
  return{supScatterOption}
}

export function getBollSeries(arr){
  return {
    type: 'arearange',
    name: '볼린저',
    data: arr,
    lineWidth:2.5,
    color:colors.bollinger,
    lineColor:colors.bollinger,
    fillOpacity:0,
    marker : markerOptions,//라인상의 동그란점(마커)제거 및 호버시 마커 액션 설정
    tooltip: {  pointFormatter: function () { return ''; }},
  }
}
export function getSeparationSeries(arr, setVal1, setVal2){
  // console.log(arr, setVal1, setVal2)
  const setVal2Round = commonFunc.decimalRound(setVal2, 2)
  return {
    type: 'arearange',
    name: `이격도(${setVal1} & ${setVal2Round}배)`,
    data: arr,
    lineWidth:2.5,
    color:colors.separation,
    lineColor:colors.separation,
    fillOpacity:0,
    marker : markerOptions,//라인상의 동그란점(마커)제거 및 호버시 마커 액션 설정
    tooltip: {  pointFormatter: function () { return ''; }},
  }
}

export function getSideWalkSeries(arr){
  // console.log(arr, setVal1, setVal2)
  return {
    type: 'arearange',
    data: arr,
    lineWidth:0,
    showInLegend : false,
    color:colors.separation,
    lineColor:colors.opa0,
    fillOpacity:0.5,
    marker : markerOptions,//라인상의 동그란점(마커)제거 및 호버시 마커 액션 설정
    tooltip: {  pointFormatter: function () { return ''; }},
  }
}





/* 


//저항선 데이터
resFlagData.push({
  x : highPriceDateTime,
  // x:candleArr[idx*12][0],
  //x:candleArr[candleArr.length-50][0],
  y:highPrice,
  title: `저항${idx+1} (${dateShort})`,
  fillColor:colors.resistanceOpa
});

//돌파점 데이터
resBreakFlagData.push({
  //x : highPriceDateTime,
  x:breakDateTime,
  y:breakHigh3Price,
  title: `월상${idx+1}(${breakDateTooltip}) : ${breakHigh3Price}`,
  fillColor:colors.resistanceOpa,
  shape: 'squarepin',
  style:{fontSize:'11px'},
  tooltip:false,
});




  //지지선 데이터
  supFlagData.push({
    x : lowPriceDateTime,
    // y: minY_Val-(minY_Val*(idx*0.2)),
    // x:candleArr[idx*12][0],
    y:lowPrice,
    title: `지지${idx+1} (${dateShort})`,
    fillColor:colors.supportOpa,
  });

  //돌파점 데이터
  supBreakFlagData.push({
    x:breakDateTime,
    y:breakLow3Price,
    title: `월하${idx+1}(${breakDateTooltip}) : ${breakLow3Price}`,
    fillColor:colors.supportOpa,
    shape: 'squarepin',
    style:{fontSize:'11px'}
  });



  const supFlagOption = {
    type: 'flags',
    name: '지지Pin',
    data: supFlagData,
    shape: 'flag',
    // lineColor:colors.support,
    showInLegend : false,
    marker: {
      enabled: false // flags의 점 비활성화
    },
    clip:true,
    
  };

  const supBreakFlagOption = {
    type: 'flags',
    name: '하향돌파',
    data: supBreakFlagData,
    shape: 'flag',
    lineColor:colors.support,
    showInLegend : false,
  };

    const resFlagOption = { //저항선 플래그
    type: 'flags',
    name: '저항Pin',
    data: resFlagData,
    shape: 'flag',
    lineColor:colors.resistance,
    showInLegend : false,
  };

  const resBreakFlagOption = { //돌파점 플래그
    type: 'flags',
    name: '상향돌파',
    data: resBreakFlagData,
    shape: 'flag',
    lineColor:colors.resistance,
    showInLegend : false,
    tooltip: {  pointFormatter: function () { return ''; }},
  };


    // const breakDateStr =  breakDate.toString().substring(0,4)+'-'+breakDate.toString().substring(4,6)+'-01';
    // const breakDateTime = new Date(breakDateStr).getTime();
    // const breakDateTooltip = breakDate.toString().substring(2,4)+'-'+breakDate.toString().substring(4,6);
    // const breakHigh3Price = candleArr.reduce((ma3Price, item) =>{											
    //   if( item[0] === breakDateTime){ma3Price = item[2];}										
    //   return ma3Price;										
    // },0);		


    // const dateShort = lowPriceDate.toString().substring(2,4)+'-'+lowPriceDate.toString().substring(4,6);
    // const breakDateStr =  breakDate.toString().substring(0,4)+'-'+breakDate.toString().substring(4,6)+'-01';
    // const breakDateTime = new Date(breakDateStr).getTime();
    // const breakDateTooltip = breakDate.toString().substring(2,4)+'-'+breakDate.toString().substring(4,6);
    // const breakLow3Price = candleArr.reduce((ma3Price, item) =>{											
    //   if( item[0] === breakDateTime){ma3Price = item[2];}										
    //   return ma3Price;										
    // },0);		




*/