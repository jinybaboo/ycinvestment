export function decimalRound(num, round){ 
    if(round===0){return Math.round(num);}
    else if(round===1){return Math.round(num * 10) / 10;}
    else if(round===2){return Math.round(num * 100) / 100;}
    else if(round===3){return Math.round(num * 1000) / 1000;}
    else if(round===4){return Math.round(num * 10000) / 10000;}
    else if(round===5){return Math.round(num * 100000) / 100000;}
    else{return -1}
}

export function getFromDateTypeToString(date){
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return year + '-' + month + '-' + day;
}

export function getyyMMFromDate(date){
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    //const day = ('0' + date.getDate()).slice(-2);
    return year + '/' + month
}

//배열 중복 제거 함수
export function removeDuplicateArray(arr){
	const set = new Set(arr);
	const uniqueArr = [...set];
	return uniqueArr;
}

// 제이슨배열 중복제거 함수
export function removeDuplicateJsonArrData(arr){
	var result = arr.filter((item1, idx1)=>{
	    return arr.findIndex((item2)=>{
	        return item1.trdDd === item2.trdDd;
	    }) === idx1;
	});
	
	return result;
}


//일반배열의 특정값을 기준으로 오름 내림차순 정렬하기 
export function sortArrayByBigOrSmall(arr, type){
	let returnData = [...arr];
	
	if(type==='big'){
		returnData.sort((a, b) => {
		    if (a < b) return 1;
		    if (a > b) return -1;
		    return 0;
		});
	}else{
		returnData.sort((a, b) => {
		    if (a < b) return -1;
		    if (a > b) return 1;
		    return 0;
		});
	}
	return returnData;
}


//제이슨배열의 특정값을 기준으로 오름 내림차순 정렬하기 
export function sortJsonArrayByBigOrSmall(jsonArr, jsonKey, type){
	let returnData = [...jsonArr];
	
	if(type==='big'){
		returnData.sort((a, b) => {
		    let aVal = a[jsonKey];
			let bVal = b[jsonKey];
		    if (aVal < bVal) return 1;
		    if (aVal > bVal) return -1;
		    return 0;
		});
	}else{
		returnData.sort((a, b) => {
		    let aVal = a[jsonKey];
			let bVal = b[jsonKey];
		    if (aVal < bVal) return -1;
		    if (aVal > bVal) return 1;
		    return 0;
		});
	}
	return returnData;
}


export function getMax(arr){
	return Math.max.apply(null, arr);
}

export function getMin(arr){
	return Math.min.apply(null, arr)
}
export function getSumArray(arr) {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    return sum;
}

export function thousandComma(num){
    return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function getKoreanEulReul(word) {
	const lastChar = word[word.length - 1];
	const isJongsung = (lastChar.charCodeAt(0) - 0xac00) % 28 > 0;
	return isJongsung ? '을' : '를';
}