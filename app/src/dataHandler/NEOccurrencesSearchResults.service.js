var lunr = require('lunr');

angular.module('evtviewer.dataHandler')
   .service('evtNEOccurrencesSearchResults', ['evtNEOccurrencesSearchIndex',
      function NEOccurrencesSearchResults(evtNEOccurrencesSearchIndex) {
   
      var regex = /[.,\/#!$%\^&\*;:{}=_`~()]/;
      
      NEOccurrencesSearchResults.prototype.getSearchResults = function (inputValue, isCaseSensitive) {
         var searchResults = getResultsMetadata(inputValue, isCaseSensitive);
         return searchResults;
      };
      
      function getIndex() {
         return evtNEOccurrencesSearchIndex.getIndex();
      }
      
      function getResultsMetadata(inputValue, isCaseSensitive) {
         var results = makeQuery(inputValue.toLowerCase());
         
         return results;
      }
      
      function makeQuery(inputValue) {
         var index = getIndex();
         var searchResults = index.query(function(q) {
            q.term(inputValue, {
               usePipeline: false
            });
         });
         return searchResults;
      }
      
      function getCaseSensitiveResults(inputValue, tokenList) {
         var results = [],
            matchStarWildcard = inputValue.match(/[*]/);
         
         for (var token in tokenList) {
   
            if(matchStarWildcard) {
               inputValue.toLowerCase();
               var result = handleWildcardInCaseSensitive(inputValue, token, tokenList, matchStarWildcard);
               if(result) {
                  results.push(result);
               }
            }
            
            if (inputValue === token.toString()) {
               results.push(
                  {
                     token: token.toString(),
                     metadata: tokenList[token],
                     resultsNumber: tokenList[token].xmlDocId.length
                  }
               );
            }
         }
         return results;
      }
   
      function handleWildcardInCaseSensitive(inputValue, token, tokenList, matchStarWildcard) {
         var inputValueLength = inputValue.length,
            wildcardPos = matchStarWildcard.index,
            tokenFirstChars = token.toString().slice(0, wildcardPos),
            inputFirstChars = inputValue.slice(0, wildcardPos),
            tokenLastChars,
            inputLastChars,
            result = {
               token: token.toString(),
               metadata: tokenList[token],
               resultsNumber: tokenList[token].xmlDocId.length
            }
         
         //se * è alla fine
         if(inputValueLength === wildcardPos+1) {
            if(tokenFirstChars === inputFirstChars) {
               return result;
            }
         }
   
         //se * è all'inizio
         if(wildcardPos === 0) {
            tokenLastChars = token.toString().slice(-inputValueLength+1);
            inputLastChars = inputValue.slice(1, inputValueLength);
            
            if(tokenLastChars === inputLastChars) {
               return result;
            }
         }
         
         // se * è nel mezzo
         if(tokenFirstChars === inputFirstChars) {
            inputLastChars = inputValue.slice(wildcardPos + 1, inputValue.length);
            tokenLastChars = token.toString().slice(-inputLastChars.length);
            if(tokenLastChars === inputLastChars) {
               return result;
            }
         }
      }
      
      function getCaseInsensitiveResults(tokenList) {
         var results = [];
         for(var token in tokenList) {
            results.push(
               {
                  token: token.toString(),
                  metadata: tokenList[token],
                  resultsNumber: tokenList[token].xmlDocId.length
               }
         );
         }
         return results;
      }
      
      NEOccurrencesSearchResults.prototype.getOccurrences = function (searchResults, currentEdition) {
            var currentResults = [],
            edition = {
               'diplomatic': function () {
               var diplomaticResults = searchResults.diplomatic;
               angular.forEach(diplomaticResults, function (result) {
                  currentResults.push(result);
               });
            },
               'interpretative': function () {
               var interpretativeResults = searchResults.interpretative;
               angular.forEach(interpretativeResults, function (result) {
                  currentResults.push(result);
               });
            },
               'critical': function () {
               var results = searchResults.interpretative || searchResults.diplomatic;
               angular.forEach(results, function (result) {
                  currentResults.push(result);
               });
            }
            };
         
         if(Object.keys(searchResults).length !== 0){
            edition[currentEdition]();
         }
         
         return currentResults;
      };
   }]);
