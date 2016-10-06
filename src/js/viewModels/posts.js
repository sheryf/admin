/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your incidents ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'moment', 'ojs/ojtable', 'ojs/ojpagingcontrol', 'ojs/ojpagingtabledatasource', 'ojs/ojcollectiontabledatasource'],
        function (oj, ko, moment) {

            function IncidentsViewModel() {
                var self = this;

                self.serviceURL = 'https://euregjug.cfapps.io/api/posts';
                self.datasource = ko.observable(); // datasource is an observable so when it is triggered/refreshed, the table component is triggered

                function parsePost(response) {
                    return {
                        id: response.id,
                        publishedOn: moment(response.publishedOn),
                        title: response.title,
                        locale: response.locale
                    };
                }
                ;
                var event = oj.Model.extend({
                    parse: parsePost
                });

                var PostCollection = oj.Collection.extend({
                    customURL: function (operation, col, options) {
                        var rv = null;
                        if(operation === 'read') {
                            rv = self.serviceURL
                                    + '?size=' + options.fetchSize
                                    + '&page=' + (options.startIndex / options.fetchSize)
                                    + '&sort=' + options.sort + ',' + options.sortDir;
                        }
                        return rv;
                    },
                    customPagingOptions: function (response) {
                        return {
                            totalResults: response['totalElements'],
                            limit: response['size'],
                            count: response['numberOfElements'],
                            hasMore: !response['last'],
                            offset: response['number'] * response['size']
                        };
                    },
                    fetchSize: 10,
                    model: new event(),
                    comparator: 'publishedOn',
                    sortDirection: -1,
                    parse: function (response) {
                        return response['content'];
                    }
                });

                self.pagingDatasource = new oj.PagingTableDataSource(new oj.CollectionTableDataSource(new PostCollection()));
            }

            /*
             * Returns a constructor for the ViewModel so that the ViewModel is constrcuted
             * each time the view is displayed.  Return an instance of the ViewModel if
             * only one instance of the ViewModel is needed.
             */
            return new IncidentsViewModel();
        }
);
