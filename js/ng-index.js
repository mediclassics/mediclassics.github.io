var app = angular.module('mediclassicsInfo', ["ngRoute", "ngSanitize"]);

app.constant("api", {

	kmapibox: {
		rooturl: "https://kmapibox.mediclassics.org" + "/api/data/",
		// rooturl: "http://cloud.mediclassics.org:8383/api/data/",
		conf : {
			headers : { },
			data: ""
			// 이게 없으면 Content-Type이 설정되지 않음 // https://stackoverflow.com/questions/24895290/content-type-header-not-being-set-with-angular-http
		}
	},
	mediclassics: {
		rooturl: "https://mediclassics.kr/api/statistics/",
		conf : {
			headers : {
				'Authorization': "b0a200dc25e74531b8cae037427d1578", 'Content-Type': "application/json;charset=utf-8"
			},
			data: "" // 이게 없으면 Content-Type이 설정되지 않음 //

		}
	}
})

app.config(['$routeProvider', function($routeProvider) {
$routeProvider
	.when('/', {
		templateUrl: 'views/main.html',
		controller: 'mainCtrl'
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
	.otherwise({
		redirectTo: '/'
	});
}]);

app.controller("mainCtrl", ['$scope', '$http', function ($scope, $http) {


}])

app.controller("DBlistCtrl", ['$scope', '$http', 'api',
function ($scope, $http, api) {

	var reqUrl = api.mediclassics.rooturl + "character-count"
	$http.get( reqUrl, api.mediclassics.conf ).then(function(res){
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
	})

}])

app.controller("DBappsCtrl", ['$scope', '$http', function ($scope, $http) {


}])

app.controller("bookShelfCtrl", ['$scope', '$http', '$routeParams', 'api',
function ($scope, $http, $routeParams, api) {

	// $routeParams.book = ["ebook", "정선의안"]
	var title = {
		"ebook" : { main: "eBook", desc: "한의학 고전 국역서" },
		"의안정선" : { main: "의안정선시리즈", desc: "한의학 고전 국역서"}
	}

	$scope.title = title[ $routeParams.book ]

	var reqUrl = api.kmapibox.rooturl + "book/" + $routeParams.book
	$http.get( reqUrl, api.kmapibox.conf ).then(function(res){
		var _data = res.data
		var i=0; var shelfsize=6; var tmp
		var ebookinfos = []
		for(i=0;i < 100; i=i+shelfsize) {
			tmp = _data.slice(i, i+shelfsize)
			if(tmp.length<1){ break; }
			ebookinfos.push (tmp)
		}
		$scope.ebookinfos = ebookinfos;
		// console.log(ebookinfos)
	})

}])
