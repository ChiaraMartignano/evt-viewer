angular.module('evtviewer.box')

.provider('evtBox', function() {

    var defaults = this.defaults;

    this.setDefaults = function(_defaults) {
        defaults = _defaults;
    };

    this.$get = function($log, parsedData, evtParser) {
        var box = {},
            collection = {},
            list = [],
            idx = 0;

        var _console = $log.getInstance('box');


        // 
        // Control function
        // 
        function updateContent(newContent) {
            var vm = this;
            vm.content = newContent;
            
            _console.log('vm - updating content ' + vm.id);
        }

        function updateState(key, value) {
            _console.log('vm - updating state '+key+': '+value);
            var vm = this;
            vm.state[key] = value;
        }

        function getState(key) {
            var vm = this;
            return vm.state[key];
        }

        function destroy() {
            var tempId = this.uid;
            // TODO: remove from list and collection
            // this.$destroy();

            _console.log('vm - destroy ' + tempId);
        }

        // Critical edition control
        function toggleCriticalAppFilter(filter, value){
            var vm = this;
            if (vm.state.filters[filter] === undefined) {
                vm.state.filters[filter] = [];
            }
            var index = vm.state.filters[filter].indexOf(value)
            if (index < 0) {
                vm.state.filters[filter].push(value);
            } else {
                vm.state.filters[filter].splice(index, 1);
            }
            _console.log('# toggleCriticalAppFilter ', vm.state.filters);
        }

        // 
        // Box builder
        // 

        box.build = function(vm) {
            var currentId = vm.id || idx++,
                currentType = vm.type || 'default',
                topMenuList = { 
                    selectors: [],
                    buttons: []
                },
                bottomMenuList = { 
                    selectors: [],
                    buttonSwitches: []
                },
                content,
                state = {},
                appFilters = [];

            var scopeHelper = {};

            if (typeof(collection[currentId]) !== 'undefined') {
                return;
            }
            
            _console.log('vm - building box for ' + currentId);

            switch (currentType) {
                case 'image':
                    topMenuList.selectors.push({ id:'page', type: 'page' });
                    topMenuList.buttons.push({ title:'Thumbnails', label: 'Thumbs' });
                    // content = '<img src="'+parsedData.getImage()+'" />';
                    content = '<img src="" />';
                    break;
                case 'text':
                    topMenuList.selectors.push({ id:'document', type: 'document' });
                    topMenuList.selectors.push({ id:'editionLevel', type: 'edition'});
                    // content = evtParser.parseWitnessText(parsedData.getDocumentsList()[0], parsedData.getWitnessesList()[0]);
                    // content = parsedData.getDocument()[0].diplomatic;
                    // content = '<evt-popover data-trigger="click" data-tooltip="Prova 2 testo in tooltip">Lorem ipsum dolor</evt-popover> sit amet, <strong>consectetuer</strong> adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, <evt-popover data-trigger="click" data-tooltip="Prova tooltip">fringilla vel</evt-popover>, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. <evt-popover data-trigger="click" data-tooltip="Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum.">Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum.</evt-popover> Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. <evt-popover data-trigger="click" data-tooltip="Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum.">Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc</evt-popover>.<evt-popover data-trigger="click" data-tooltip="Prova 2 testo in tooltip">Lorem ipsum dolor</evt-popover> sit amet, <strong>consectetuer</strong>.';
                    break;
                case 'witness':
                    topMenuList.selectors.push({ id:'witnesses_'+currentId, type: 'witness'});
                    console.log(parsedData.getCriticalEntriesFilters());
                    appFilters = parsedData.getCriticalEntriesFilters();
                    state.filters = {};
                    break;
            }

            scopeHelper = {
                // expansion
                uid: currentId,
                defaults: angular.copy(defaults),

                // model
                topMenuList: topMenuList,
                bottomMenuList: bottomMenuList,
                content: content,
                state: state,
                appFilters: appFilters,

                // function
                updateContent: updateContent,
                updateState: updateState,
                getState: getState,
                destroy: destroy,
                toggleCriticalAppFilter: toggleCriticalAppFilter
            };

            collection[currentId] = angular.extend(vm, scopeHelper);
            list.push({
                id: currentId,
                type: currentType
            });

            return collection[currentId];
        };


        //
        // Service function
        // 

        box.getById = function(currentId) {
            if (collection[currentId] !== 'undefined') {
                return collection[currentId];
            }
        };

        box.getList = function() {
            return list;
        };

        return box;
    };

});