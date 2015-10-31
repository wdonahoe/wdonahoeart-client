'use strict';

import angular from 'angular';

fileReaderService.$inject = ['$q']

class fileReaderService {

	constructor($q){
		this.$q = $q;
	}

	onLoad() {

		return () => {
		    scope.$apply(function () {
		        deferred.resolve(reader.result);
		    });
		};

	}

	onError() {

		return () => {
		    scope.$apply(function () {
		        deferred.reject(reader.result);
		    });
		};

	}

	onProgress() {

		return (event) => {
		    scope.$broadcast("fileProgress",
		        {
		            total: event.total,
		            loaded: event.loaded
		        });
		};

	}

	getReader() {

		var reader = new FileReader();
		reader.onload = onLoad(reader, deferred, scope);
		reader.onerror = onError(reader, deferred, scope);
		reader.onprogress = onProgress(reader, scope);
		return reader;

	}

	readAsDataURL() {

		var deferred = this.$q.defer();
		 
		var reader = getReader(deferred, scope);    
		reader.readAsText(file);
		 
		return deferred.promise;

	}

}

export default angular.module('wdonahoeart.fileReaderService', []).service('fileReaderService', fileReaderService)