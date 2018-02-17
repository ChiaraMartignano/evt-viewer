/**
 * @ngdoc service
 * @module evtviewer.dataHandler
 * @name evtviewer.dataHandler.search.evtSearchParser
 * @description
 * # evtSearchParser
 * In this service is defined a constructor and his object. The object exposed methods to handle search parser.
 *
 * @requires evtviewer.dataHandler.search.evtSearchDocument
 *
 * @returns {object} Parser object
 *
 * @author GC
 */

angular.module('evtviewer.dataHandler')
.service('evtSearchParser', ['evtSearchDocument', function Parser(evtSearchDocument) {
   this.Doc = evtSearchDocument;
   this.parsedDocs = [];

   /**
    * @ngdoc method
    * @module evtviewer.dataHandler
    * @name evtviewer.dataHandler.search.evtSearchParser#parseDocument
    * @methodOf evtviewer.dataHandler.search.evtSearchParser
    *
    * @description
    * This method parse a specific XML document.
    *
    * @param {element} xmlDocDom XML element to be parsed
    * @param {str} currentEdition The document's current edition (diplomatic, interpretative or critical)
    *
    * @author GC
    */
   Parser.prototype.parseDocument = function (xmlDocDom, currentEdition) {
      
      this.Doc.hasNamespace(xmlDocDom);
      var docs = this.Doc.getDocsTitle();
      
      console.time('PARSE-TEXT');
      this.parsedDocs = this.Doc.parseText(xmlDocDom, currentEdition, docs, this.Doc.ns, this.Doc.nsResolver);
      console.timeEnd('PARSE-TEXT');
      
      return this.parsedDocs;
   };
}]);