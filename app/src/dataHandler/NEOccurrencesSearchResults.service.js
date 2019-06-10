var lunr = require('lunr');

angular.module('evtviewer.dataHandler')
   .service('evtNEOccurrencesSearchResults', ['evtNEOccurrencesSearchIndex', 'parsedData',
      function NEOccurrencesSearchResults(evtNEOccurrencesSearchIndex, parsedData) {
   
      var regex = /[.,\/#!$%\^&\*;:{}=_`~()]/;
      
      NEOccurrencesSearchResults.prototype.getSearchResults = function (inputValue, field) {
         var searchResults = getResultsMetadata(inputValue, field);
         return searchResults;
      };
      
      function getIndex() {
         return evtNEOccurrencesSearchIndex.getIndex();
      }
      
      function getResultsMetadata(inputValue, field) {
         var res = makeQuery(inputValue.toLowerCase(), field),
             results = [],
             refs = [];
         angular.forEach(res, function(result) {
            var partialResults = result.matchData.metadata;
            for (var i in partialResults) {
               results.push(getResultData(partialResults[i], field));
            }
            if (refs.indexOf(result.ref) < 0) {
               refs.push(result.ref);
            }
         });
         return results;
      }
      
      function makeQuery(inputValue, field) {
         var index = getIndex();
         var searchResults = index.query(function(q) {
            q.term(inputValue, {
               fields: [field],
               usePipeline: false
            });
         });
         return searchResults;
      }

      function getResultData(result, field) {
         var resultData = {};
         var data = result[field];
         var langs = data.lang.sort();
         resultData._langs = [];
         for (var j = 0; j < langs.length; j++) {
            if (resultData._langs.indexOf(langs[j]) < 0) {
               resultData._langs.push(langs[j]);
               resultData[langs[j]] = {
                  _indexes: []
               }
            }
         }
         resultData._ref = data.ref[0];
         resultData._result = data[field][0];
         for (var i = 0; i < data.text.length; i++) {
            if (!resultData[data.lang[i]][data.text[i]]) {
               resultData[data.lang[i]]._indexes.push(data.text[i]);
               resultData[data.lang[i]][data.text[i]] = {
                  form: data.text[i],
                  docs: {},
                  docsId: [data.docId[i]]
               }
               resultData[data.lang[i]][data.text[i]].docs[data.docId[i]] = {
                  label: parsedData.getDocument(data.docId[i]).label,
                  divs: [parsedData.getDiv(data.divId[i]).label],
                  divsId: [data.divId[i]]
               }
            } else {
               if (resultData[data.lang[i]][data.text[i]].docsId.indexOf(data.docId[i]) < 0) {
                  resultData[data.lang[i]][data.text[i]].docsId.push(data.docId[i])
                  resultData[data.lang[i]][data.text[i]].docs[data.docId[i]] = {
                     label: parsedData.getDocument(data.docId[i]).label,
                     divs: [parsedData.getDiv(data.divId[i]).label],
                     divsId: [data.divId[i]] 
                  }
               } else if (resultData[data.lang[i]][data.text[i]].docs[data.docId[i]].divsId.indexOf(data.divId[i]) < 0) {
                  resultData[data.lang[i]][data.text[i]].docs[data.docId[i]].divs.push(parsedData.getDiv(data.divId[i]).label);
                  resultData[data.lang[i]][data.text[i]].docs[data.docId[i]].divsId.push(data.divId[i]);
               }
            }
         }
         return resultData;
      };
      
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
   }]);
