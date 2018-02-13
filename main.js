'use strict';

var decisionTree = angular.module('AssociationRule',[]);

decisionTree.controller('AssociationRuleController',  function ($scope) {
	$scope.rule = [];
	$scope.transaksi = [];
	$scope.itemSet = [];
	$scope.itemSetTemp = [];
	$scope.itemSetRemoved = [];
	$scope.sebaranNilai = [];
	$scope.banyakItemSetDitransaksi = [];
	$scope.indexLoop = 1;
	$scope.nilaiSupport = [];
	$scope.readFile = function(file){
		$scope.transaksi = [];
		readData(file).then(function(rawData) {
			var dataJadi = [];
		 	var  dataArray = [];
			dataArray = rawData.split("\n");
				 
			// data[0] = ["x","y"];
			for(var i = 0; i<dataArray.length ; i++)
			{
				$scope.transaksi.push(dataArray[i].replace(/(\r\n|\n|\r)/gm,"").split(","));
				
			}
			// console.log($scope.transaksi);
			$scope.$apply();
		});

	};
	$scope.initializationItemSet = function(){
		let jumlahTransaksi = $scope.transaksi.length;
		for (let i = 0; i < jumlahTransaksi; i++) {
			let jumlahItemPertransaksi = $scope.transaksi[i].length;
			for (let j = 0; j < jumlahItemPertransaksi; j++) {
				
				if($scope.checkArray([$scope.transaksi[i][j]], $scope.itemSet) == -1){
					$scope.itemSet.push([$scope.transaksi[i][j]]);
					// alert();
				}
				// console.log($scope.itemSet)
				if($scope.banyakItemSetDitransaksi[$scope.checkArray([$scope.transaksi[i][j]], $scope.itemSet)] == null)
					$scope.banyakItemSetDitransaksi[$scope.checkArray([$scope.transaksi[i][j]], $scope.itemSet)] = 0;
				$scope.banyakItemSetDitransaksi[$scope.checkArray([$scope.transaksi[i][j]], $scope.itemSet)]++;
			}
		}
		let jumlahItemSet = $scope.itemSet.length;
		for (let i = 0; i < jumlahItemSet; i++) {			
			$scope.nilaiSupport[i] = $scope.banyakItemSetDitransaksi[i]/jumlahTransaksi;
		}
		for (let i = 0; i < jumlahItemSet; i++) {			
			if($scope.nilaiSupport[i] < 0.3){
				$scope.itemSetRemoved.push($scope.itemSet[i]);
				$scope.banyakItemSetDitransaksi.splice(i, 1);
				$scope.itemSet.splice(i, 1);
				$scope.nilaiSupport.splice(i, 1);
				i = 0;
			}
		}

		// $scope.itemSet = $.extend(true, [], $scope.itemSetTemp);
	}
	$scope.cariAssociation = function(){
		let jumlahItemSet = $scope.itemSet.length;
		let tempArray = [];
		for (let i = 0; i < jumlahItemSet; i++) {
			for (let j = 0; j < jumlahItemSet; j++) {
				if($scope.itemSet[i].length == $scope.indexLoop){
					if($scope.itemSet[j].length == 1 && $scope.itemSet[i] != $scope.itemSet[j]){
						tempArray = [];
						for (let k = 0; k < $scope.itemSet[i].length; k++) {
							tempArray.push($scope.itemSet[i][k]);
						}
						tempArray.push($scope.itemSet[j][0]);
						if($scope.checkArray(tempArray, $scope.itemSetRemoved) > -1)
							break
						else if($scope.checkArray(tempArray, $scope.itemSet ) == -1){
							$scope.itemSet.push(tempArray);
						}
						// if($scope.banyakItemSetDitransaksi[$scope.checkArray(tempArray, $scope.itemSet)] == null)
						// 	$scope.banyakItemSetDitransaksi[$scope.checkArray(tempArray, $scope.itemSet)] = 0;
						// $scope.banyakItemSetDitransaksi[$scope.checkArray(tempArray, $scope.itemSet)]++;
					}

				}
			}
		}
		jumlahItemSet = $scope.itemSet.length;
		for (let i = 0; i < jumlahItemSet; i++) {
			$scope.banyakItemSetDitransaksi[i] = $scope.checkJumlahArray($scope.itemSet[i], $scope.transaksi);
		}
		let jumlahTransaksi = $scope.transaksi.length;
		for (let i = 0; i < jumlahItemSet; i++) {			
			$scope.nilaiSupport[i] = $scope.banyakItemSetDitransaksi[i]/jumlahTransaksi;
		}
		for (let i = 0; i < jumlahItemSet; i++) {
			if($scope.nilaiSupport[i] < 0.3){
				$scope.itemSetRemoved.push($scope.itemSet[i]);
				$scope.banyakItemSetDitransaksi.splice(i, 1);
				$scope.itemSet.splice(i, 1);
				$scope.nilaiSupport.splice(i, 1);
				i = 0;
			}

		}
		
		$scope.indexLoop++;

	}
	$scope.getConfidence = function(){
		$scope.confidence = [];
		$scope.AssociationRule = [];
		let jumlahItemSet = $scope.itemSet.length;
		// console.log($scope.itemSet);
		for (let i = 0; i < jumlahItemSet; i++) {
			let jumlahItemPerItemSet = $scope.itemSet[i].length;
			if(jumlahItemPerItemSet >= 2)
				for (let j = 0; j < jumlahItemPerItemSet; j++) {
					if($scope.banyakItemSetDitransaksi[i] / $scope.banyakItemSetDitransaksi[$scope.checkArray([$scope.itemSet[i][j]], $scope.itemSet)] > 0.8){
						let temp = $scope.banyakItemSetDitransaksi[i] / $scope.banyakItemSetDitransaksi[$scope.checkArray([$scope.itemSet[i][j]], $scope.itemSet)];
						$scope.confidence.push(temp);
						$scope.AssociationRule.push([$scope.itemSet[i][j], $scope.itemSet[i], temp]);
					}
				}
		}
		console.log($scope.itemSet[0]);
		console.log($scope.checkArray(["mentega"], $scope.itemSet));
	}

	$scope.checkArray = function(arrayDicari, ArraySumber){
		let jumlahArraySumber = ArraySumber.length;
		var jumlahArrayDicari = arrayDicari.length;
		var dataInArray = 0;
		for (let i = 0; i < jumlahArraySumber; i++) {
			var jumlahArrayDicari = arrayDicari.length;
			var dataInArray = 0;
			for (let j = 0; j < jumlahArrayDicari; j++) {
				if(ArraySumber[i].indexOf(arrayDicari[j]) > -1){
					dataInArray++;
				}
				else
					break;
			}
			if(dataInArray == jumlahArrayDicari && dataInArray != 0)
			return i;	
		}
		
		return -1;
	}

	$scope.checkJumlahArray = function(arrayDicari, ArraySumber){
		let jumlahArraySumber = ArraySumber.length;
		var jumlahArrayDicari = arrayDicari.length;
		var dataInArray = 0;
		var jumlahDataInArray = 0;
		for (let i = 0; i < jumlahArraySumber; i++) {
			var jumlahArrayDicari = arrayDicari.length;
			var dataInArray = 0;
			for (let j = 0; j < jumlahArrayDicari; j++) {
				if(ArraySumber[i].indexOf(arrayDicari[j]) > -1){
					dataInArray++;
				}
				else
					break;
			}
			if(dataInArray == jumlahArrayDicari && dataInArray != 0)
				jumlahDataInArray++;	
		}
		
		return jumlahDataInArray;
	}


	

});