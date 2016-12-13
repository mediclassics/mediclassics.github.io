var app = angular.module('ebookshelf', ["ngSanitize"]);

app.constant("api", {
		rooturl: "http://kmapibox.mediclassics.org" + "/api/data/",
		// rooturl: "http://cloud.mediclassics.org:8383/api/data/",
		conf : {
			headers : {
			},
			data: ""
			// 이게 없으면 Content-Type이 설정되지 않음 // https://stackoverflow.com/questions/24895290/content-type-header-not-being-set-with-angular-http
		}
	}
)

app.controller("ebookshelfCtrl", function ($scope, $http, api) {

	(function(){
		var reqUrl = api.rooturl + 'ebook'
		$http.get( reqUrl, api.conf ).then(function(res){
			var _data = res.data
			var i=0; var shelfsize=6; var tmp
			var ebookinfos = []
			for(i=0;i < 100; i=i+shelfsize) {
				tmp = _data.slice(i, i+shelfsize)
				if(tmp.length<1){ break; }
				ebookinfos.push (tmp)
			}
			$scope.ebookinfos = ebookinfos;
			console.log(ebookinfos)
		})
	})();

})


app.controller("offbookshelfCtrl", function ($scope, $http, api) {

/*
	(function(){
		var reqUrl = api.rooturl + 'offbook'
		$http.get( reqUrl, api.conf ).then(function(res){
			var _data = res.data
			var i=0; var shelfsize=6; var tmp
			var ebookinfos = []
			for(i=0;i < 100; i=i+shelfsize) {
				tmp = _data.slice(i, i+shelfsize)
				if(tmp.length<1){ break; }
				ebookinfos.push (tmp)
			}
			$scope.ebookinfos = ebookinfos;
			console.log(ebookinfos)
		})
	})();
*/

})
