var lunr = require('lunr');

angular.module('evtviewer.dataHandler')
   .service('evtNEOccurrencesSearchIndex', [function Index() {
      this.index = {};
      
      Index.prototype.createIndex = function (parsedElementsForIndexing) {

         console.time('INDEX');
         
         this.index = lunr(function () {
            this.pipeline.remove(lunr.trimmer);
            this.pipeline.remove(lunr.stemmer);
            this.pipeline.remove(lunr.stopWordFilter);
   
            this.tokenizer.separator = /[\s,.;:/?!()\'\"]+/;
            
            this.field('text');
            this.field('ref');
            this.field('lang');
            this.ref('ref');
            
            var keys = Object.keys(parsedElementsForIndexing[0]);
            for (var i = 0; i < keys.length; i++) {
               this.use(addMetadata, keys[i], parsedElementsForIndexing);
            }
            
            for (var i in parsedElementsForIndexing) {
               this.add(parsedElementsForIndexing[i]);
            }
         });
         console.log(this.index);
         console.timeEnd('INDEX');
         return this.index;
      };
      
      Index.prototype.getIndex = function () {
        return this.index;
      };
      
      function addMetadata(builder, key, data) {
         var pipelineFunction = function (token) {
            var docIndex = builder.documentCount - 1;
            token.metadata[key] = data[docIndex][key];
            return token;
         };
         
         lunr.Pipeline.registerFunction(pipelineFunction, key);
         builder.pipeline.add(pipelineFunction);
         builder.metadataWhitelist.push(key);
      }
      
   }]);
