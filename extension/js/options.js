(function(window, $) {

    function save_options(option, callback) {
        
        chrome.storage.local.get('options', function(items) {
            var options = items['options'] || {},
            name;

            // filter list entries are concatenated
            // other values will be overwritten
            for (name in option) {
                options[name] =  $.isArray(option[name]) ? 
                    options[name].concat(option[name]) : option[name];
            }
           

            chrome.storage.local.set({'options': options}, function() {
                callback();

                chrome.runtime.getBackgroundPage(function(backend) {
                    backend.restart();
                });
            });
        });
    }

    function restore_options() {

        chrome.storage.local.get('options', function(items) {
            var options = items['options'],
            name,
            val;
            for (name in options) {
                val = options[name];
            }

            var filters = options['job-filters'];
            var list = "<div><ul class='unstyled'>";
            for (var i = 0; i < filters.length; i++) {
                list += "<li><span>" + filters[i] + " </span><i class='icon-trash'></i>" + "</li>\n";
            }
            list += "</ul></div>";
            $('#filter-jobs').html(list);
        });
    }

    $(document).on('change', '#jenkins-url,#refresh-time ', function() {
        var input = $(this),
        option = {},
        name = input.attr('name'),
        value = input.val();

        option[name] = value;

        save_options(option, function() {
            if (input.attr('type') === 'range') {
                input.next().val(value);
            }

            input.parent().find('span.save-info')
            .addClass('text-success')
            .text(' saved')
            .prepend($('<i></i>', { 'class': 'icon-ok' }));
        });
    });

    // adds a job filter (a name) to the array 'job-filter'
    // on the options object
    $(document).on('click', '#add-job-filter', function() {
        var input = $('#job-filter'),
        value = []; 
        value.push(input.val());
        var option = {};
        option['job-filters'] = value;
        save_options(option, function() { 
            restore_options(); 
        });
    });

    // removes a job filter (a name) from the array 'job-filter'
    // on the options object. this method doesn't use the
    // save_options method because the arrays are concatenated!
    $(document).on('click', '.icon-trash', function() {
	    var filter = $(this);
        var deletionElement = filter.parent().find('span');
        chrome.storage.local.get('options', function(items) {
            var filters = items['options']['job-filters'];
            filters.splice(filters.indexOf(deletionElement.text().trim()), 1);
            var options = {};
            items.options['job-filters'] = filters;
            chrome.storage.local.set(items, function() { 
                restore_options(); 
            });
        })   
    });
    
        
    $(function() {
        restore_options();
    });
    
} (window, jQuery));
