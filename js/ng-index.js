var app = angular.module('mediclassicsInfo', ["ngRoute"]);

app.constant("api", {

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

app.config(['$routeProvider', function($routeProvider) {
$routeProvider
	.when('/', {
		templateUrl: 'views/main.html',
		controller: 'mainCtrl'
	})
	.when('/about', {
		templateUrl: 'views/tmp.html',
		controller: 'tmpCtrl'
	})
	.when('/contact', {
		templateUrl: 'views/tmp.html',
		controller: 'tmpCtrl'
	})
	.when('/error', {
		templateUrl: 'views/error.html',
		controller: 'errorCtrl'
	})
	.when('/db/list', {
		templateUrl: 'views/db-list.html',
		controller: 'DBlistCtrl'
	})
	.when('/db/apps', {
		templateUrl: 'views/db-apps.html',
		controller: 'DBappsCtrl'
	})
	.when('/shelf/:book', {
		templateUrl: 'views/bookshelf.html',
		controller: 'bookShelfCtrl'
	})
	.when('/data/ebook', {
		templateUrl: 'views/eBooklist.html',
		controller: 'eBooklistCtrl'
	})
	.otherwise({
		redirectTo: '/error'
	});
}]);

app.controller("mainCtrl", ['$scope', function ($scope) {


}])

app.controller("tmpCtrl", ['$scope', function ($scope) {


}])

app.controller("errorCtrl", ['$scope', function ($scope) {


}])

app.controller("DBlistCtrl", ['$scope', '$http', 'api',
function ($scope, $http, api) {

	$scope.booklistloaded = false

	var reqUrl = api.gas_mediclassics.rooturl + "?order=statistics"

	$http.get( encodeURI(reqUrl) ).then(function(res){
		// console.log(res)
		var _list = res.data.data.DATA.map(function(e) {
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
	})

}])

app.controller("DBappsCtrl", ['$scope', '$http', function ($scope, $http) {


}])

app.controller("bookShelfCtrl", ['$scope', '$http', '$routeParams', 'api', '$window',
function ($scope, $http, $routeParams, api, $window) {

	$scope.booklistloaded = false

	// $routeParams.book = ["ebook", "정선의안"]
	var title = {
		"ebook" : { main: "eBook", desc: "한의학 고전 국역서" },
		"정선의안" : { main: "정선의안시리즈", desc: "한의학 고전 국역서"}
	}

	var seriesno = { "ebook" : 1, "정선의안": 2 }

	function getEbookInfo( where ){
		var ebookinfo = (where.platform === "gitbook")?
			{
				"ebook": "https://www.gitbook.com/book/kmongoing/" + where.eBookId + "/details",
				"coverImg": "https://git.gitbook.com/raw/kmongoing/" + where.eBookId +  "/master/cover_small.jpg?token=a21vbmdvaW5nOjU2NDU5NzQ0LWE3YWUtNDk3Yi1iNGU1LTBlZTJjYzRkNzI4Yw%3D%3D"
			} : {
				"ebook": where.eBookUrl,
				"coverImg": where.coverImgUrl
			}
		return ebookinfo
	}

	$scope.title = title[ $routeParams.book ]

	var reqUrl = api.gas_mediclassics.rooturl + "?order=info&target=bookshelf&seriesno=" + seriesno[ $routeParams.book ]

	$http.get( encodeURI(reqUrl) ).then(function(res){
		var _data = res.data.data.map(function(e,i,arr){
            return {
                "publishDate": e["발행일"],
                "title": e["제목"],
                "url": getEbookInfo( { "eBookId":e.gitbookid, "platform": e.platform, "eBookUrl": e.eBookUrl, "coverImgUrl": e.coverImgUrl } )
			}
        })

		var i=0; var shelfsize=6; var tmp
		var ebookinfos = []
		for(i=0;i < 60; i=i+shelfsize) {
			tmp = _data.slice(i, i+shelfsize)
			if(tmp.length<1){ break; }
			ebookinfos.push (tmp)
		}
		$scope.ebookinfos = ebookinfos;
		console.log(ebookinfos)

		$scope.booklistloaded = true
	})

	$scope.openSheets = function(){

		var mima = prompt("Please enter admin password");
		var api_end_point = api.gas_base.rooturl + "?order=auth&serial=" + mima

		$http.get( encodeURI( api_end_point ) ).then(function(res){
			console.log(res)
			if( res.data.data.auth  ){
				$window.open("https://docs.google.com/spreadsheets/d/1qQ0Frx6hN9X-T_EVJer3sy-LTSw1oM9hweDj9XD_nC8/", "_blank")
			} else {
				alert("wrong password");
			}
		})
		.catch(function(err){
			console.log(err)
			alert("wrong password");
		})

	}

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
			$scope.ebook_traffic = []
			$scope.booklistloaded = true
			$scope.$apply()

		})

	})

}])
