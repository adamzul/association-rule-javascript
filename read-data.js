// function getData(element){
// 	readData(element).then(function(rawData) {
// 		var dataJadi = [];
// 	 	var  dataArray = [];
// 		dataArray = rawData.split("\n");
			 
// 		// data[0] = ["x","y"];
// 		for(var i = 0; i<dataArray.length; i++)
// 		{
// 			dataJadi[i] = dataArray[i].split(",");
// 			for(var j = 0; j<dataJadi[i].length;j++)
// 				dataJadi[i][j] = Number(dataJadi[i][j]); // --> 'done!'
// 		}
// 			// $scope.data = dataJadi;
// 			console.log(dataJadi);
// 			alert("get data done")
// 			return dataJadi;
// 	});
// }


function readData(element) {
    var promise = new Promise(function(resolve, reject) {
	   	var w = 0;
	   	var dataReturn;
		var files = document.getElementById(element).files;
		var file = files[0];
		var reader = new FileReader();

		// If we use onloadend, we need to check the readyState.
		reader.onloadend = function(evt) {
			if (evt.target.readyState == FileReader.DONE) { // DONE == 2
				dataReturn = evt.target.result;		
			}
		  
		};
			
		var blob = file;
		reader.readAsBinaryString(blob);
	   	var cek = function(){
	   		if(dataReturn == null)
	   		{
	   			setTimeout(cek,1000);
	   		}else{
		    	resolve(dataReturn);

	   		}

	   	}
		cek();
   });
   return promise;
}

