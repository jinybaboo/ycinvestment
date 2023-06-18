import styled from "styled-components";
import React, { useState } from 'react'
import colors from "../common/colors";

import {RiDeleteBinLine} from 'react-icons/ri';
import {CiSettings} from 'react-icons/ci';


import {IoIosExpand} from 'react-icons/io';
import { useQuery } from "react-query";

import * as api  from '../common/commonApi';
import { useEffect } from "react";
import { Link } from "react-router-dom";
import HighChart from "../components/HighChart";
import { decimalRound, getKoreanEulReul } from "../common/commonFunc";
import HighChartExpand from "../components/HighChartExpand";


const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;


// 헤더
const Background = styled.div`
    width: 100%; min-height:${windowHeight}px; background-color: ${colors.backgroundBlack}; 
`
const Header = styled.header`
    width:100%; height: 50px; display: flex; border-bottom: 1px solid ${colors.textWhite}; position:fixed; top:0; background-color: ${colors.backgroundBlack};
    z-index: 1100;
`
const HeaderSpace = styled.div`
    width:100%; height: 50px;
`
const Logo = styled.span`
    font-size: 22px; color:${colors.textYellow}; font-weight: 800; line-height: 50px; margin-left: 30px; letter-spacing: -0.7px;
`
const Nav = styled.nav`
    padding-left: 60px;
`
const NavTxt = styled.span`
    font-size: 16px; color:${colors.white}; font-weight: 500; line-height: 50px; cursor: pointer; padding: 10px 20px;
`
const NavTxtSelected = styled(NavTxt)` color:${colors.textYellow}; font-weight:700; margin:0; cursor: pointer;` 

const RightSelWrap = styled.div`
    position:absolute; right:100px; padding-top: 8px; 
`

const CustomSelect = styled.select`
    width:250px; height:34px; background-color: ${colors.backgroundBlack}; color:${colors.white}; border-radius: 6px;
    margin-right: 95px; border:1px solid ${colors.textWhite};  background-color:${colors.lightBlackBackground};
`
const CustomOption = styled.option`

`
const BookPlusBox = styled.div`
   width:34px; height:34px; line-height:31px; border:1px solid ${colors.textWhite}; position: absolute; right: 45px; top:8px; border-radius: 6px;
   color:${colors.textWhite}; font-size: 26px; text-align: center; cursor: pointer;
`
const BookDelBox = styled.div`
   width:34px; height:34px; line-height:29px; border:1px solid ${colors.textWhite}; position: absolute; right: 0px; top:8px; border-radius: 6px;
   color:${colors.textWhite}; font-size: 26px; text-align: center; cursor: pointer;
`


// 메인박스
const Main = styled.main`
    display: flex;
`

// 왼쪽 메뉴
const LeftMenuWrap = styled.div`
    width:250px;  height:100%; padding: 20px 0 ; border-right: 1px solid ${colors.textWhite};
    position: fixed; left:0; overflow-y: scroll; 
    &::-webkit-scrollbar {
        width: 3px;
    }
    &::-webkit-scrollbar-thumb {
        border-radius: 3px;
        background: ${colors.buttonBlue};
    }
`
const LeftMenuBox = styled.div`
    width:180px; height:40px; line-height:40px; color:${colors.textWhite}; position: relative;
    font-size: 14px; font-weight:500; padding-left: 10px; margin-left:30px; border-bottom: 1px solid ${colors.textWhite}; 
`

const LeftMenuCheck =styled.input`
    width:16px; height: 16px; position: absolute; right: 5px; top:8.5px;
`

// 커스텀 생성 모달
const ModalWrap = styled.div`
    width: 100vw; height: 100vh; background-color: rgba(225,225,225,0.5); position: fixed; top:0; left:0; display: flex;  align-items: center; justify-content: center;
    z-index: 9000;
`
const ModalBox = styled.div`
    width:560px; border-radius: 12px; background-color: ${colors.white};
`;
const ModalHead = styled.div`
    width:100%; height: 76px; border-bottom: 1px solid ${colors.grayUnderline}; display: flex; align-items: center; padding:24px; justify-content: space-between;
`
const ModalHeadTitle = styled.span`
    font-size: 22px; font-weight: 700; color:${colors.textBlack};
`
const ModalCloseX = styled.div`
    width:24px; height:76px; line-height:76px; font-size: 24px; text-align: center; cursor:pointer;
`
const ModalBottomBtnBox = styled.div`
    display: flex; width:100%; justify-content: space-between; padding: 24px;
`
const ModalBottomBtn = styled.div`
    width:250px; height:48px; line-height: 48px; text-align: center; background-color: ${colors.buttonBlue}; color:${colors.white};
    font-size: 16px; font-weight: 700; border-radius: 12px; cursor: pointer;
`
const ModalBottomBtnInactive = styled(ModalBottomBtn)`
    background-color: ${colors.textWhite}; color:${colors.buttonInactiveTxtGray};
`
const ModalInnerBox = styled.div`
    padding:24px; 
`
const ModalInnerTitle = styled.div`
    font-size: 14px; font-weight: 500; color:${colors.textBlack};
`
const ModalInput = styled.input`
    width:100%; height:44px; border-radius: 8px; border:1px solid ${colors.grayUnderline}; padding:0 10px; 
`

const DelModalTxtBox = styled.div`
    display: flex; justify-content: space-between;
`
const DelModalTxt = styled.span`
    font-size: 14px; margin-bottom:4px;
`
const DelModalImgBox = styled.div`
    cursor: pointer;
`
const ModalRadioBtnWrap = styled.div`
    display:flex;
`
const ModalRadioBtnBox = styled.div`
    width:130px; height:40px; border-radius:8px; border: 1px solid ${colors.grayUnderline}; font-size: 14px; font-weight:500;
    cursor:pointer; display: flex; align-items: center; padding-left: 16px; color:${colors.buttonInactiveTxtGray};
`
const ModalRadioBtnBoxActive = styled(ModalRadioBtnBox)`
    border: 1px solid ${colors.buttonBlue}; background-color: ${colors.buttonBlueBackground}; color:${colors.textBlack};
`
const ModalRadioCircieBox = styled.div`
    width:16px; height:16px; border-radius: 50%; border:1px solid #CCCCCC;
`
const ModalRadioCircieBoxActive = styled.div`
    width:16px; height:16px; border-radius: 50%; background-color: ${colors.buttonBlue}; display: flex; justify-content: center; align-items: center;
`
const ModalRadioCircieBoxInner = styled.div`
    width:8px; height:8px; border-radius: 50%; background-color: ${colors.white};
`
const ModalRadioTxt = styled.span`
    margin-top: -1px; margin-left: 10px;
`


const Space12 = styled.div`height:12px;`

const SpaceW12 = styled.div`width:12px;`


// 차트
const RightChartWrap = styled.div`
    width:calc(100vw - 250px); padding:24px 0; display: flex; flex-wrap: wrap; margin-left: 250px;
`
const ChartBox = styled.div`
    /* width:calc(100% - 50px); */ width:720px; height:500px; border-radius: 12px; border:1px solid ${colors.textWhite}; margin-left: 24px; margin-bottom: 24px;  
    background-color: ${colors.lightBlackBackground};  transition: height 0.5s ease-in-out; 
`
const ChartTitleBox = styled.div`
    width:100%; height:45px; border-bottom:1px solid ${colors.textWhite}; padding:0 20px; display: flex; justify-content: space-between;
`
const ChartTitle = styled.span`
    font-size: 16px; line-height:45px; font-weight: 700; color:${colors.textWhite};
`
const ChartRightBtnBox = styled.div`
    width:100px; height:45px; display: flex; align-items: center; justify-content: flex-end;
`
const ChartIconBox = styled.div`
    width:32px; height:32px; border:1px solid ${colors.textWhite}; border-radius: 4px;  display: flex; align-items: center; justify-content: center; 
    cursor: pointer; margin-left: 10px;
`
const ChartInner = styled.div`
    width:100%; height:453px;  border-radius:0 0 12px 12px; overflow-y: hidden; position: relative;
`

const ChartBoardSmall = styled.div`
    width:200px; height: 40px; background-color: ${colors.grayUnderline}; position: absolute; left:70px; top:10px; z-index: 100;
`

export default function Home (){
    const [currentMenu, setCurrentMenu] = useState('전체');
    const [isCustomModalShow, setIsCustomModalShow] = useState(false);
    const [isDelModalShow, setIsDelModalShow] = useState(false);
    const [isSettingModalShow, setIsSettingModalShow] = useState(false);
    const [isExpandModalShow, setIsExpandModalShow] = useState(false);

    const [expandTitle, setExpandTitle] = useState('');
    const [customTitle, setCustomTitle] = useState('');
    
    const [settingTitle, setSettingTitle] = useState('');
    const [settingValue1, setSettingValue1] = useState('');
    const [settingValue2, setSettingValue2] = useState(0);
    
    const [checkboxArr, setCheckboxArr] = useState([]);

    const indexArr =['KOSPI200','KOSDAQ100','DOWJONES','NASDAQ','SP500','NIKKEI225','SHANGHAI','CHINA_A50','SZSE_COMPONENT','HANGSENG','EURO_STOXX_50'];
    const exchangeArr = ['DOLLAR_INDEX','USD_KRW','EUR_USD','USD_JPY','USD_CNY'];
    const bondArr = ['KOR_BOND_2YEAR','KOR_BOND_3YEAR','KOR_BOND_5YEAR','KOR_BOND_10YEAR','KOR_BOND_30YEAR','US_BOND_2YEAR','US_BOND_10YEAR','US_BOND_30YEAR','GER_BOND_2YEAR','GER_BOND_10YEAR','GER_BOND_30YEAR'];
    const allChkArr = [...indexArr, ...exchangeArr, ...bondArr];

    const {isLoading, isError, data:allData} = useQuery(['allData'], ()=> api.getAllData());
    const {data:customList, refetch:refetchCustomList} = useQuery(['customList'], ()=> api.getCustomList());
    const {data:allSettingData} = useQuery(['allSettingData'], ()=> api.getAllChartSetting());


    function changeMenu(txt,e){ 
        setCurrentMenu(txt);
        if(txt==='전체'){changeCheckMenu(allChkArr);}
        else if(txt==='지수'){changeCheckMenu(indexArr);}
        else if(txt==='환율'){changeCheckMenu(exchangeArr);}
        else if(txt==='채권'){changeCheckMenu(bondArr);}
    }

    function closeCustomModal(){setIsCustomModalShow(false); setCustomTitle('');}
    function closeDelModal(){setIsDelModalShow(false);}
    function changeCustomTitle(e){setCustomTitle(e.target.value);}
    async function sendCustomSave(){
        if(customTitle.length<2){alert('커스텀 이름은 2자 이상으로 입력해 주세요.'); return;}

        const checkArr = checkboxArr.reduce((returnArr, item) =>{			
            const key = Object.keys(item)[0];
            const isChecked = item[key];						
            if(isChecked){returnArr.push(key)}								
            return returnArr;								
        },[]);		
        
        await api.insertCustomSave(customTitle, checkArr.toString())
        closeCustomModal();
        refetchCustomList();
    }


    function changeSettingValue2(e){
        setSettingValue2(e?.target?.value);
    }

    async function delCustom(num, title){
        const eulReul = getKoreanEulReul(title);
        if(!window.confirm(title+eulReul+' 삭제 하시겠습니까')){return;}
        await api.deleteCustomSave(num);
    }

    async function openSettingModal(title){
        setSettingTitle(title);
        const res = await api.getChartSetting(title);
        setSettingValue1(res.value1);
        setSettingValue2(decimalRound(res.value2, 2));
        
        
        setIsSettingModalShow(true);
    }

    useEffect(()=>{
        if (!isLoading && !isError) {
            let defaultMenuChkArr = [];
            // console.log(allData)
            allData.forEach((item, idx)=>{
                const dataName = Object.keys(item)[0];
                const tempObj = {};
                tempObj[dataName] = true;
                defaultMenuChkArr.push(tempObj);
            })
            setCheckboxArr(defaultMenuChkArr);
          }
    },[isLoading])


    function clickMenuCheck(dataName){
        const returnArr = [];
        checkboxArr.forEach((item)=>{
            const key = Object.keys(item)[0];
            const val = !item[key];
            if(key===dataName){
                const tempObj = {};
                tempObj[key] = val;
                returnArr.push(tempObj);
            }else{
                returnArr.push(item)
            }
        })
        setCheckboxArr(returnArr);
    }

    function changeCheckMenu(arr){
        const returnArr = [];
        checkboxArr.forEach((item)=>{
            const key = Object.keys(item)[0];
            if(arr.includes(key)){
                const tempObj = {};
                tempObj[key] = true;
                returnArr.push(tempObj);
            }else{
                const tempObj = {};
                tempObj[key] = false;
                returnArr.push(tempObj);
            }
        })
        setCheckboxArr(returnArr);
    }

    function changeCustomList(e){
        const selectedArr = e.target.value.split(',');
        changeCheckMenu(selectedArr);
        setCurrentMenu('');
    }

    async function sendChartSetting(){
        const res = await api.updateChartSetting(settingTitle, settingValue1, settingValue2);
        if(res.status===200){
            setIsSettingModalShow(false);
        }else{
            alert('저장시 오류가 발생하였습니다. 다시한번 시도해 주세요.')
        }
    }


    function openExpandModal(dataName){
        setIsExpandModalShow(true);
        setExpandTitle(dataName);
    }


    if(isLoading){return null}

    return (
        <Background>
            <HeaderSpace />
            <Header>
                <Logo>YC INVESTMENT</Logo>
                <Nav>
                    {currentMenu==='전체'?<NavTxtSelected onClick={(e)=>{changeMenu('전체', e)}}>전체</NavTxtSelected>:<NavTxt onClick={(e)=>{changeMenu('전체', e)}}>전체</NavTxt>}
                    {currentMenu==='지수'?<NavTxtSelected onClick={(e)=>{changeMenu('지수', e)}}>지수</NavTxtSelected>:<NavTxt onClick={(e)=>{changeMenu('지수', e)}}>지수</NavTxt>}
                    {currentMenu==='환율'?<NavTxtSelected onClick={(e)=>{changeMenu('환율', e)}}>환율</NavTxtSelected>:<NavTxt onClick={(e)=>{changeMenu('환율', e)}}>환율</NavTxt>}
                    {currentMenu==='채권'?<NavTxtSelected onClick={(e)=>{changeMenu('채권', e)}}>채권</NavTxtSelected>:<NavTxt onClick={(e)=>{changeMenu('채권', e)}}>채권</NavTxt>}
                </Nav>


                <RightSelWrap>
                    <CustomSelect onChange={changeCustomList}>
                        <CustomOption value={allChkArr}>커스텀 리스트</CustomOption>
                        {customList.map((item,idx)=><CustomOption key={idx+''} value={item.checkArr} >{item.title}</CustomOption>)}
                    </CustomSelect>

                    <BookPlusBox onClick={()=>{setIsCustomModalShow(true)}}>+</BookPlusBox>

                    <BookDelBox onClick={()=>{setIsDelModalShow(true)}}>
                        <RiDeleteBinLine size={18}/>
                    </BookDelBox>
                </RightSelWrap>

            </Header>

            <Main>

                <LeftMenuWrap>
                {   
                    allData.map((item, idx)=>{
                        const dataName = Object.keys(item)[0];
                        const isChecked = checkboxArr[idx] === undefined ? false : checkboxArr[idx][dataName];
                        return(
                            <LeftMenuBox onClick={()=>{clickMenuCheck(dataName)}} key={dataName}> {dataName} <LeftMenuCheck type="checkbox" checked={isChecked} onChange={()=>{}} /></LeftMenuBox>
                        )
                    })
                }

                    <Space12/><Space12/><Space12/><Space12/><Space12/><Space12/>
                </LeftMenuWrap>

                <RightChartWrap>
                {
                    allData.map((item, idx)=>{
                        const dataName = Object.keys(item)[0];
                        const data = item[dataName];

                        return(
                            checkboxArr.map((item2)=>{
                                const dataNameTemp = Object.keys(item2)[0];
                                const isChecked = item2[dataNameTemp];

                                var settingValSet = allSettingData.filter( item3 => (						
                                    item3.chartName === dataNameTemp
                                ));		
                                
                                if(dataNameTemp===dataName && isChecked){
                                    const settingVal1 = settingValSet[0]?.value1===undefined?'60MA':settingValSet[0]?.value1;
                                    const settingVal2 = settingValSet[0]?.value2===undefined?1.5:settingValSet[0]?.value2;			

                                    return(
                                        <ChartBox key={idx+''}>
                                            <ChartTitleBox>
                                                <ChartTitle>{dataName}</ChartTitle>
                                                <ChartRightBtnBox>
                                                    <ChartIconBox>
                                                        <Link to={{ pathname: `/expand`, search: `?name=${dataName}`  }} target="_blank">
                                                            {/* <IoIosExpand color={colors.textWhite} style={{marginTop:4}} onClick={()=>{openExpandModal(dataName)}}/> */}
                                                            <IoIosExpand color={colors.textWhite} style={{marginTop:4}} />
                                                        </Link>
                                                    </ChartIconBox>
                                                    <ChartIconBox onClick={()=>{openSettingModal(dataName)}}>
                                                        <CiSettings color={colors.textWhite} size={22} />
                                                    </ChartIconBox>
                    
                                                </ChartRightBtnBox>
                                            </ChartTitleBox>
                                            <ChartInner>
                                                {/* <ChartBoardSmall>

                                                </ChartBoardSmall> */}
                                                <HighChart data={data} dataName={dataName} settingVal1={settingVal1} settingVal2={settingVal2}/>
                                            </ChartInner>
                                        </ChartBox>
                                    )
                                }
                            })
                        )// 첫번째 map return
                       
                    })
                }
                   

                </RightChartWrap>

            </Main>

            {isCustomModalShow && <ModalWrap>
                <ModalBox>
                    <ModalHead>
                        <ModalHeadTitle>커스텀 생성</ModalHeadTitle>
                        <ModalCloseX onClick={closeCustomModal}>&times;</ModalCloseX>
                    </ModalHead>    

                    <ModalInnerBox>
                        <ModalInnerTitle>커스텀 이름</ModalInnerTitle>
                        <Space12 />
                        <ModalInput placeholder="커스텀 이름을 입력해 주세요. (10자 이내)" maxLength={10} onChange={changeCustomTitle} />
                    </ModalInnerBox>

                    <ModalBottomBtnBox>
                        <ModalBottomBtnInactive onClick={closeCustomModal}>취소</ModalBottomBtnInactive>
                        <ModalBottomBtn onClick={sendCustomSave}>생성하기</ModalBottomBtn>
                    </ModalBottomBtnBox>

                </ModalBox>

            </ModalWrap>
            }


            {isDelModalShow && <ModalWrap>
                <ModalBox style={{width:220}}>
                    <ModalHead>
                        <ModalHeadTitle>커스텀 삭제</ModalHeadTitle>
                        <ModalCloseX onClick={closeDelModal}>&times;</ModalCloseX>
                    </ModalHead>    

                    <ModalInnerBox>
                        {customList.map((item,idx)=><DelModalTxtBox key={idx+''} >
                            <DelModalTxt>{item.title}</DelModalTxt>
                            <DelModalImgBox onClick={()=>{delCustom(item.num, item.title)}}><RiDeleteBinLine color={colors.buttonInactiveTxtGray}/></DelModalImgBox>
                        </DelModalTxtBox>)}
                    </ModalInnerBox>

                </ModalBox>
            </ModalWrap>
            }



            {isSettingModalShow && <ModalWrap>
                <ModalBox>
                    <ModalHead>
                        <ModalHeadTitle>{settingTitle} 설정</ModalHeadTitle>
                        <ModalCloseX onClick={()=>{setIsSettingModalShow(false)}}>&times;</ModalCloseX>
                    </ModalHead>    

                    <ModalInnerBox>
                        <ModalInnerTitle>이격도 이동평균선</ModalInnerTitle>
                        <Space12 />
                        <ModalRadioBtnWrap>
                            {settingValue1==='60MA'?
                            (
                            <ModalRadioBtnBoxActive onClick={()=>{setSettingValue1('60MA')}}>
                                <ModalRadioCircieBoxActive><ModalRadioCircieBoxInner /></ModalRadioCircieBoxActive>
                                <ModalRadioTxt>60MA</ModalRadioTxt>
                            </ModalRadioBtnBoxActive>
                            )
                            :
                            (
                            <ModalRadioBtnBox onClick={()=>{setSettingValue1('60MA')}}>
                                <ModalRadioCircieBox />
                                <ModalRadioTxt>60MA</ModalRadioTxt>
                            </ModalRadioBtnBox>
                            )
                            }
                            <SpaceW12 />
                            {settingValue1==='120MA'?
                            (
                            <ModalRadioBtnBoxActive onClick={()=>{setSettingValue1('120MA')}}>
                                <ModalRadioCircieBoxActive><ModalRadioCircieBoxInner /></ModalRadioCircieBoxActive>
                                <ModalRadioTxt>120MA</ModalRadioTxt>
                            </ModalRadioBtnBoxActive>
                            )
                            :
                            (
                            <ModalRadioBtnBox onClick={()=>{setSettingValue1('120MA')}}>
                                <ModalRadioCircieBox />
                                <ModalRadioTxt>120MA</ModalRadioTxt>
                            </ModalRadioBtnBox>
                            )
                            }
                        </ModalRadioBtnWrap>
                        
                    </ModalInnerBox>

                    <ModalInnerBox style={{paddingTop:0}}>
                        <ModalInnerTitle>이격도 배수</ModalInnerTitle>
                        <Space12 />
                        <ModalRadioBtnWrap>
                            <ModalInput value={settingValue2} onChange={changeSettingValue2}/>
                        </ModalRadioBtnWrap>
                    </ModalInnerBox>

                    <ModalBottomBtnBox>
                        <ModalBottomBtnInactive onClick={()=>{setIsSettingModalShow(false)}}>취소</ModalBottomBtnInactive>
                        <ModalBottomBtn onClick={sendChartSetting}>저장하기</ModalBottomBtn>
                    </ModalBottomBtnBox>

                </ModalBox>

            </ModalWrap>
            }


            {isExpandModalShow && 
            <ModalWrap>
                <ModalBox style={{width:windowWidth-60, height:windowHeight-40}}>
                    <ModalHead style={{}}>
                        <ModalHeadTitle>{expandTitle}</ModalHeadTitle>
                        <ModalCloseX onClick={()=>{setIsExpandModalShow(false)}}>&times;</ModalCloseX>
                    </ModalHead>    
                    <HighChartExpand dataName={expandTitle}/>
                </ModalBox>
            </ModalWrap>
            }


        </Background>
    )

}

