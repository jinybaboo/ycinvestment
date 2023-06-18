import React, { useEffect, useState } from 'react'
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import HighchartsMore from 'highcharts/highcharts-more';  // 추가 모듈 가져옴

import * as chartFunc from '../common/chartFunc';
import * as api  from '../common/commonApi';
import * as chartSeries from '../common/chartSeries';
import { useQuery} from 'react-query' 
import colors from '../common/colors';
import { useLocation, useParams } from 'react-router-dom';
import { getOneData } from '../common/commonApi';

HighchartsMore(Highcharts); // // 모듈을 추가로 로드

const windowHeight = window.innerHeight;


export default function ChartComponent ({data, dataName, height, from}){
  const location = useLocation();
  const searchParams = new URLSearchParams(location?.search);
  const name = searchParams.get('name'); // 파라미터 값 추출

  const [dataSet, setDataSet] = useState([]);
  const [currentDataName, setCurrentDataName] = useState('');
  const [currentHeight, setCurrentHeight] = useState(0);

  useEffect(()=>{

      if(from==='home'){
        setDataSet(data);
        setCurrentDataName(dataName);
        setCurrentHeight(height);
      }else if(from==='expand'){
        
        setCurrentDataName(name)
        setCurrentHeight(windowHeight);
      }
      
      async function fetchData(){const tempData = await getOneData(name); setDataSet(tempData)}

      from ==='expand' && fetchData();



  },[]);




  let dataArr_All = chartFunc.getReArrangeData(dataSet) // 데이터 숫자 및 단위 정리
  let dataArr_All_Month = chartFunc.changeDateToMonth(dataArr_All); //코스피 월간 전체 데이터 (2001 ~ 현재)
  //console.log(dataArr_All_Month)

  const cutYear = 2011;
  const candleArr =  chartFunc.getCandleChartData(dataArr_All_Month, cutYear);
  const volumeArr = chartFunc.getVolumeData(dataArr_All_Month, cutYear);
  const volumeColors = chartFunc.getVolumeColors(volumeArr);
  //console.log(volumeColors)

  // 이동평균선
  let ma3Arr = chartFunc.getMovingAverage(dataArr_All_Month, '3', cutYear);
  let ma12Arr = chartFunc.getMovingAverage(dataArr_All_Month, '12', cutYear);
  let ma20Arr = chartFunc.getMovingAverage(dataArr_All_Month, '20', cutYear);
  let ma60Arr = chartFunc.getMovingAverage(dataArr_All_Month, '60', cutYear);
  let ma120Arr = chartFunc.getMovingAverage(dataArr_All_Month, '120', cutYear);

  //기간이 모자라서 캔들 대비 ma 기간 데이터가 모자랄 경우, 빈공간으로 채워줘야함
  const ma3Gap = candleArr.length - ma3Arr.length;
  const ma24Gap = candleArr.length - ma20Arr.length;
  const ma60Gap = candleArr.length - ma60Arr.length;
  const ma120Gap = candleArr.length - ma120Arr.length;


  ma3Arr = chartFunc.fillShortDateForMa(ma3Gap, candleArr, ma3Arr);
  ma20Arr = chartFunc.fillShortDateForMa(ma24Gap, candleArr, ma20Arr);
  ma60Arr = chartFunc.fillShortDateForMa(ma60Gap, candleArr, ma60Arr);
  ma120Arr = chartFunc.fillShortDateForMa(ma120Gap, candleArr, ma120Arr);

  //이격도 
  let separationArr = chartFunc.getSeparationArr(ma60Arr);

  //볼린져밴드
  //console.log(dataArr_All_Month)
  const bollArr = chartFunc.calculateBollingerBands(dataArr_All_Month);
  //let bollArr = chartFunc.getBollingerBands(ma20Arr);


  //저항선, 지지선
  const {resLine1, resLine2, resLine3, resInfo} = chartFunc.getResistanceLineData(ma3Arr, ma20Arr, candleArr);
  const {supLine1, supLine2, supLine3, supInfo} = chartFunc.getSupportLineData(ma3Arr, ma20Arr, candleArr);
  ///console.log(supLine1, supLine2, supLine3, supInfo);
  //console.log(resInfo, supInfo)


  const options = {
    chart:{
      height:currentHeight,
      //backgroundColor:colors.grayUnderline,
      zoomType: 'x', // x축 방향으로 줌 활성화
    },

    legend: { //하단 차트이름으로 온오프 버튼
      enabled: true
    },

    rangeSelector: {
      selected: 1
    },
    
    title: {
      text: ''
    },
    xAxis: {
      type: 'datetime', // x축의 단위를 날짜로 설정
      dateTimeLabelFormats: { // x축 날짜 포맷 변경
        day: '%Y-%m-%d', // 일 단위 포맷: 년-월-일 (예: 2023-01-01)
        week: '%Y-%m-%d', // 주 단위 포맷
        month: '%Y-%m', // 월 단위 포맷
        year: '%Y', // 년 단위 포맷
      },
      gridLineWidth:0.8,
    },

    yAxis: [{
      labels: {
          align: 'right',
          x: -3
      },
      title: {
          text: '',
      },
      height: '80%',
      lineWidth: 2,
      resize: {
          enabled: true
      },
      gridLineWidth:0,
    }, {
        labels: {
            align: 'right',
            x: -3
        },
        title: {
            text: ''
        },
        top: '85%',
        height: '15%',
        offset: 0,
        lineWidth: 2,
        gridLineWidth:0,
    }], //yAxis 끝

    tooltip: {
        split: true, //툴팁이 각각의 데이터대로 여러개로 나뉨
        xDateFormat: '%Y-%m', //x축 툴팁 포맷
        crosshairs: true,  //x축 시계열 이동시 세로 가이드선 보여주기 여부
    },

    plotOptions: {
      flags: {
        y:-60, //flag 위치 띄움
      }
    },
    
    series: [], //series 끝
    
  } //options 끝



  //캔들 시리즈 및 데이터 데이터 추가
  const candleSeries = chartSeries.getCandleSeries(candleArr, currentDataName);
  options.series.push(candleSeries);

  //이동평균선, 이격도 시리즈 및 데이터 추가
  const maSeriesArr = chartSeries.getMovingAverageSeries(ma3Arr, ma20Arr, ma60Arr, ma120Arr);
  maSeriesArr.forEach(item=>options.series.push(item));

  //거래량 시리즈 및 데이터 추가
  const volumeSeries = chartSeries.getVolumeSeries(volumeArr, volumeColors);
  options.series.push(volumeSeries);

  //저항선 시리즈 및 데이터 추가
  let resAndSupSeriesArr = chartSeries.getResAndSupSeriesArr(resLine1,resLine2,resLine3,supLine1,supLine2,supLine3);
  resAndSupSeriesArr.forEach(item=>options.series.push(item))
  
  // 저항선 flag, 상승돌파점 및 scatter (저항선과 최고가 만나는점 포인트) 시리즈 및 데이터 추가
  const {resFlagOption, resBreakFlagOption, resScatterOption} = chartSeries.getResFlagAndScatterSeires(resInfo, candleArr);
  options.series.push(resFlagOption);
  options.series.push(resBreakFlagOption);
  options.series.push(resScatterOption);

  // 지지선 flag 하락돌파점 및 scatter (지지선과 최저가 만나는점 포인트) 시리즈 및 데이터 추가
  const {supFlagOption, supBreakFlagOption, supScatterOption} = chartSeries.getSupFlagAndScatterSeires(supInfo, candleArr);
  options.series.push(supFlagOption);
  options.series.push(supBreakFlagOption);
  options.series.push(supScatterOption);

  // 볼린저밴드 시리즈 및 데이터 추가
  const bollSeriesArr = chartSeries.getBollSeries(bollArr);
  options.series.push(bollSeriesArr);
  
  // 이격도 및 데이터 추가
  const separationSeriesArr = chartSeries.getSeparationSeries(separationArr);
  options.series.push(separationSeriesArr);
  



  return(
    <div>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
      />
    </div>
  );
}

