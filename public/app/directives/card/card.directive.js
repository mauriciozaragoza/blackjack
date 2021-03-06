/**
 * Created by Mauricio on 4/21/2015.
 */

angular.module('BlackjackApp')
    .directive('card', [function () {
        return {
            restrict: 'EA',
            templateUrl: 'app/directives/card/card.html',
            scope: {
                value: '=',
                index: '=',
                horizontal: '='
            },
            link: function(scope) {
                scope.image = scope.value.name + '_of_' + scope.value.color + '.svg';
            }
        };
    }]);