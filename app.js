angular.module('YGBM', ['ngSanitize'])

    .factory('DataSvc', function($http, $sce) {
        return {
            videos: $http.get('videos.json').then(getData)
        };

        function getData(res) {
            return res.data.map(parse).sort(compareDates);

            function parse(n) {
                var url = (n.url.match(/youtube.+v=([^/]+)\/?/) || [])[1];
                return {
                    url: $sce.trustAsResourceUrl(url ? 'https://www.youtube.com/embed/' + url : n),
                    date: new Date(n.date)
                };
            }

            function compareDates(a, b) {
                return b.date - a.date;
            }
        }
    })

    .controller('MainCtrl', function($scope, DataSvc) {

        var i = 0;
        var videos;

        DataSvc.videos.then(function (_videos) {
            videos = _videos;
            i = 0;
            $scope.video = videos[i];
            updatePrevNext();
        });

        $scope.prev = function() {
            if (videos[i+1]) $scope.video = videos[++i];
            updatePrevNext();
        };

        $scope.next = function() {
            if (i > 0) $scope.video = videos[--i];
            updatePrevNext();
        };

        function updatePrevNext() {
            $scope.hasPrev = i < videos.length - 1;
            $scope.hasNext = i > 0;
        }
    });