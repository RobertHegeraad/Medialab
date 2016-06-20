var app = {
    initialize: function() {
        // document.addEventListener('deviceready', this.onDeviceReady, false);
        app.onDeviceReady();    // Mimick deviceready event
    },
    onDeviceReady: function() {
        console.log('Device ready');

        view.init();

        // map.init();

        // Geeft error in browser
        // location.get(function(position) {
        //     console.log("Lat: " + position.coords.latitude);
        //     console.log("Long: " + position.coords.longitude);
        // }, function(error) {
        //     // console.log("Error " + error.code + ": " error.message);
        // });

        $(document).on('click', '.nav-bar-item.search-icon', function(e) {
            view.home();
            $('#request').focus();
        });

        $(document).on('click', '.review-add-image', review.addImage);

        $(document).on('click', '#save-review-btn', review.save);

        $(document).on('click', '#rate-review-btn', review.rate);
        $(document).on('click', '#rate-review', function() {
            notice.show('Bedankt voor je deelname!');
            review.rate();
        });

        $(document).on('click', '#like-review-btn', review.like);
    }
};

var view = {
    current: 'home',
    stack: ['home'],
    init: function() {
        $(document).on('click', '[data-view]', function(e) {
            var page = $(this).data('view');
            view.load({
                page: page
            });
        });
        $(document).on('click', '#back-btn', this.back);
    },
    home: function() {
        $('#page-title').html('The Golden Ticket');
        $('#back-btn').hide();
        
        view.show('home', function() {
            $('.page').each(function(i, o) {
                if(i != 0) {
                    $(o).remove();
                }
            });
            
            view.stack = ['home'];

            var pages = $('.page');
            $('#pages').css('width', 100 * pages.length + '%');
            $('.page').css('width', 100 / pages.length + '%');
        });
    },
    back: function() {
        var index = view.stack.lastIndexOf(view.current);   // Vind de eerste index
        if(index == 0) {
            return;
        }

        $('#page-title').html('The Golden Ticket'); // Title van nieuwe pagina pakken

        $('#pages').animate({
            'left': '+=100%'
        }, 300, function() {
            view.stack.pop();
            
            view.current = view.stack[index-1];
            if(index == 1)
            $('#back-btn').hide();

            $('#pages .page:eq(' + index + ')').remove();

            var pages = $('.page');
            $('#pages').css('width', 100 * pages.length + '%');
            $('.page').css('width', 100 / pages.length + '%');
        });
    },
    load: function(data) {
        data = data || {};

        var $page = $('#' + data.page);

        view.stack.push(data.page);
        
        view.show(data.page);

        view.current = data.page;

        request.get('views/' + data.page + '.html', function(html) {
            // Put the data on the page
            for(d in data) {
                html = html.replace(new RegExp('{{' + d + '}}', 'g'), data[d]);
            }

            // Create the page from html
            var $newPage = $(html);
            $('#pages').append($newPage);

            $('#back-btn').toggle(data.page != 'home');

            var title = $newPage.data('title');
            $('#page-title').html(title);

            var pages = $('.page');
            $('#pages').css('width', 100 * pages.length + '%');
            $('.page').css('width', 100 / pages.length + '%');
        });
    },
    show: function(page, fn) {
        console.log('Current page ' + view.current);
        console.log('Showing page ' + page);

        view.current = page;

        $('#pages').animate({
            'left': page == 'home' ? '0%' : '-=100%'
        }, 300, fn);
    }
};

// Geeft error in browser
// var location = {
//     get: function(success, error) {
//         navigator.geolocation.getCurrentPosition(success, error);
//     }
// };

var map = {
    map: null,

    marker: null,

    init: function() {
        map.map = new google.maps.Map(document.getElementById('map-container'), {
            center: {lat: 51.923493, lng: 4.478339 },
            scrollwheel: false,
            disableDefaultUI: true,
            mapTypeControl: false,
            // mapTypeId: google.maps.MapTypeId.SATELLITE,
            zoom: 17
        });

        map.marker = new google.maps.Marker({
            position: {lat: -25.363, lng: 131.044},
            map: map.map
        });
    },

    reload: function() {
        google.maps.event.trigger(map.map, "resize");
    },

    addMarker: function(lat, long) {
        map.marker.setPosition(new google.maps.LatLng(lat, long));

        map.marker.setMap(map.map);

        map.map.setCenter(map.marker.getPosition());
    }
};

var review = {
    addImage: function() {
        // Open storage and select image / Take picture with camera

        $('.review-add-image').removeClass('hidden');
    },
    save: function() {
        alert('Jouw review is opgeslagen!');
        view.home();
    },
    rate: function() {
        $('#rate-review').fadeToggle(300);
    },
    like: function() {
        notice.show('Je hebt deze review aan je favorieten toegevoegd!');
    }
};

var request = {
    get: function(resource, cb) {
        this.send('get', resource, cb)
    },

    post: function(resource, data, cb) {
        this.send('post', resource, cb, data)
    },

    send: function(type, resource, cb, data) {
        var o = {
            type: type,
            url: resource,
            success: cb,
            cache: false
        };

        $.ajax(o);
    }
};

var $menu = $('#menu-section'),
    $overlay = $('#menu-overlay');

var menu = {
    show: function(e) {
        menu.toggle(0);
    },

    hide: function(e) {
        menu.toggle(-100);
    },

    toggle: function(percent) {
        $overlay.fadeToggle(200);
        $menu.animate({'left': percent + '%'}, 300);
    },

    select: function(e) {
        var target = $(this).data('view'),
            replace = $(this).data('replace');

        view[target](replace);
    }
};

var notice = {
    check: function(ms) {
        if(store.has('notice')) {
            this.show(store.get('notice'), ms);
            store.remove('notice');
        }
    },

    flash: function(string) {
        store.set('notice', string);
    },

    show: function(string, ms) {
        ms = ms || 2000;

        var $notice = $('#notice');

        $notice.html('<div>' + string + '</div>').fadeIn(400);

        setTimeout(function() {
            $notice.fadeOut(400);
        }, ms);
    },

    stick: function(string) {
        $('#notice').html('<div>' + string + '</div>').fadeIn(400).addClass('pulse');
    },

    close: function() {
        $('#notice').fadeOut(400);
    }
};

var storage = {
    has: function(key) {
      var item = window.localStorage.getItem(key);
      if(item !== null && item !== undefined) {
        return true;
      }
      return false;
    },

    set: function(key, value) {
      window.localStorage[key] = JSON.stringify(value);
    },

    get: function(key) {
      return JSON.parse(window.localStorage[key]);
    },

    save: function(key, value) {
      this.set(key, value);
      return this.get(key);
    },

    remove: function(key) {
        window.localStorage.removeItem(key);
    },

    clear: function() {
        window.localStorage.clear();
    }
};

app.initialize();