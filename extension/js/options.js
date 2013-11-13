(function(window, $) {

    function save_options(option, callback) {
        
        chrome.storage.local.get('options', function(items) {
            var options = items['options'] || {},
            name;

            for (name in option) {
                options[name] = option[name];
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

                $('#options-form input[name="' + name + '"]').val(val);
            }
        });

        chrome.storage.local.get('job-filters', function(items) {
            var filters = items['job-filters'];
            var t = "<div><ul class='unstyled'>";
            for (var i = 0; i < filters.length; i++) {
                t += "<li>" + filters[i] + " <i class='icon-trash'></i>"  +"</li>\n";
            }
            t += "</ul></div>";
            console.log(t);
            $('#filter-jobs').html(t);
        });
    }

    $(document).on('change', '#options-form #jenkins-url,#refresh-time ', function() {
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

    $(document).on('click', '#add-job-filter', function() {
        var input = $('#job-filter'),
        value = input.val();
        
        chrome.storage.local.get('job-filters', function(items) {
            var filters = items['job-filters'] || [];
            filters.push(value);
            chrome.storage.local.set({'job-filters': filters}, function() {
                callback();
            });
        });
    });

    $(document).on('click', '.icon-trash', function() {
	var filter = $(this);
	   // implement deleting
    });
    
        
    $(function() {
        restore_options();
    });
    
} (window, jQuery));
