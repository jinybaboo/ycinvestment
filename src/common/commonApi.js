import axios from 'axios';

let BASE_URL = 'http://1.234.5.5:8090';
    BASE_URL = 'http://localhost:8090';

export const getOneData = async (dataName) => {
    let url = `${BASE_URL}/get/oneData?dataName=${dataName}`;
    try {
      const res = await axios.get(url);
      return res.data;
    } catch (error) {
      console.error('getOneData 오류', error);
    }
};

export const getAllData = async () => {
  let url = `${BASE_URL}/get/allData`;
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    console.error('getAllData 오류', error);
  }
};

export const getCustomList = async () => {
  let url = `${BASE_URL}/get/customList`;
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    console.error('getCustomList 오류', error);
  }
};

export const getAllChartSetting = async () => {
  let url = `${BASE_URL}/get/allChartSetting`;
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    console.error('getCustomList 오류', error);
  }
};


export const getChartSetting = async (chartName) => {
  let url = `${BASE_URL}/get/chartSetting?chartName=${chartName}`;
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    console.error('getCustomList 오류', error);
  }
};



// insert & update
export const insertCustomSave = async (title, checkArr) =>{
  let url = `${BASE_URL}/insert/customSave`;
  const data = {title, checkArr};
  try {
    const res = await axios.post(url, data);
    return res;
  } catch (error) {
    console.error('insertCustomSave 오류', error);
  }
}

export const updateChartSetting = async (chartName, value1, value2) =>{
  let url = `${BASE_URL}/insert/chartSettingUpdate`;
  const data = {chartName, value1, value2};
  
  try {
    const res = await axios.post(url, data);
    return res;
  } catch (error) {
    console.error('updateChartSetting 오류', error);
  }
}

// delete
export const deleteCustomSave = async (num) =>{
  let url = `${BASE_URL}/insert/customSaveDelete`;
  const data = {num};
  try {
    const res = await axios.post(url, data);
    return res;
  } catch (error) {
    console.error('deleteCustomSave 오류', error);
  }
}