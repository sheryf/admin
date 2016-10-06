/*
 * Your dashboard ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'moment', 'ojs/ojtable', 'ojs/ojcollectiontabledatasource', , 'ojs/ojdatetimepicker', 'ojs/ojtimezonedata'],
        function (oj, ko, moment) {

            function EventsViewModel() {


                var self = this;

                self.serviceURL = 'https://euregjug.cfapps.io/api/events';
                self.datasource = ko.observable(); // datasource is an observable so when it is triggered/refreshed, the table component is triggered

                function parseEvent(response) {
                    return {
                        id: response.id,
                        heldOn: oj.IntlConverterUtils.dateToLocalIso(moment(response.heldOn).toDate()),
                        name: response.name,
                        speaker: response.speaker
                    };
                }
                ;
                var event = oj.Model.extend({
                    parse: parseEvent
                });


                var EventCollection = oj.Collection.extend({
                    url: self.serviceURL,
                    model: new event(),
                    comparator: 'heldOn',
                    sortDirection: -1,
                    parse: function (response) {
                        return response['content'];
                    }
                });
                self.datasource(new oj.CollectionTableDataSource(new EventCollection()));
            }

            /*
             * Returns a constructor for the ViewModel so that the ViewModel is constrcuted
             * each time the view is displayed.  Return an instance of the ViewModel if
             * only one instance of the ViewModel is needed.
             */
            return new EventsViewModel();
        }
);
