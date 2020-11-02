var app = angular.module('mediclassicsInfo', ["ngRoute"]);

app.constant("api", {

	rooturl: "https://mediclassics.kr/api/statistics/",
	conf : {
		headers : {
// 				'Authorization': "b0a200dc25e74531b8cae037427d1578",
			'Authorization': '2e04658beced4490b7a5f147450dd365',
			'Content-Type': "application/json;charset=utf-8"
		},
		data: "" // 이게 없으면 Content-Type이 설정되지 않음 //
	},

	gas_base : { 		//  google apps script
		rooturl: "https://script.google.com/macros/s/AKfycbympvympXtKsR7l5B7-cZ_UTUgQtfa0Ew8beP-UiEGbeWw8XLg/exec"
	},
	gas_gitbook: { 		//  google apps script
		rooturl: "https://script.google.com/macros/s/AKfycbzz7e9tE1MeS6PGZbaU168rjaWCf_hhZqZzaQH6QPYmlrMCQYg4/exec"
	},
	gas_mediclassics: { //  google apps script
		rooturl: "https://script.google.com/macros/s/AKfycbzRr3GWJ45uUc57IcNxbOX35Aetv23PHlhm_vLKSYqZI7UzzCao/exec"
	}

})


app.controller("DBlistCtrl", ['$scope', '$http', 'api',
function ($scope, $http, api) {

	$scope.booklistloaded = false

	// var reqUrl = api.gas_mediclassics.rooturl + "?order=statistics"
	var reqUrl = api.rooturl + "character-count"

	$http.get( encodeURI(reqUrl), api.conf ).then(function(res){
		console.log(res)
		// var _list = res.data.data.DATA.map(function(e) {
		var _list = res.data.DATA.map(function(e) {
		    return {
				id: e.book_id,
				title: e.book_nm_kor,
				size: e.count,
				volumes: e.volumes.length
		    };
		})

		$scope.dblist = _list;
		console.log(_list)
		$scope.booklistloaded = true

	}).catch(function(e){
		console.log(e)
		alert("통신 장애로 데이터를 불러오지 못했습니다.")
		$scope.dblist = []
		$scope.booklistloaded = true
		$scope.$apply()
	})


}])

app.controller("DBappsCtrl", ['$scope', '$http', function ($scope, $http) {


}])

app.controller("eBooklistCtrl", ['$scope', '$http', 'api',
function ($scope, $http, api) {

	$scope.booklistloaded = false

	var reqUrl = api.gas_gitbook.rooturl + "?order=tunnel&endpoint=books"

	function apiend_traffic(bookid){
		return api.gas_gitbook.rooturl + "?order=tunnel&endpoint=book/" + bookid + "/traffic"
	}

	var booklist = {}

/*
	//apibase?order=tunnel&endpoint=books
	//apibase?order=tunnel&endpoint=book/kmongoing/sanghankyung
	//apibase?order=tunnel&endpoint=book/kmongoing/sanghankyung/traffic
*/

	$http.get( encodeURI(reqUrl) )
	.then(function(res){

		var _list = res.data.data.list
		var promises = []

		for(var i=0;i<_list.length;i++){
			(function(i){
				booklist[ _list[i].id.split("/")[1] ] = {
					"title": _list[i].title,
					"created": _list[i].dates.created,
					"urls": _list[i].urls
				}

				promises.push( $http.get( encodeURI( apiend_traffic(_list[i].id) ) ) )
			})(i)
		}
		// console.log( booklist )
		Promise.all( promises ).then(function(values){
			console.log( values )
			$scope.ebook_traffic = values.map(function(e){
				var tmp = {}
				tmp.id = e.config.url.split("/")[8]
				tmp.title = booklist[tmp.id].title
				tmp.created = booklist[tmp.id].created
				tmp.urls = booklist[tmp.id].urls
				tmp.traffic = e.data.data
				// console.log(tmp)
				return tmp
			 });

			$scope.booklistloaded = true
			$scope.$apply()

		}).catch(function(e){
			console.log(e)
			alert("통신 장애로 데이터를 불러오지 못했습니다.")
			$scope.ebook_traffic = []
			$scope.booklistloaded = true
			$scope.$apply()
		})

	})

}])
