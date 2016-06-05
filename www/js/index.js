var app = {
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        console.log('Device ready');

        location.get(function(position) {
            console.log("Lat: " + position.coords.latitude);
            console.log("Long: " + position.coords.longitude);
        }, function(error) {
            console.log("Error " + error.code + ": " error.message);
        });
    }
};

var view = {
    load: function() {
        // Slide to next view

        $('#view').animate({
            'left': '-=100%'
        }, 500);
    }
};

var location = {
    get: function(success, error) {
        navigator.geolocation.getCurrentPosition(success, error);
    }
};

var map = {
    map: null,

    marker: null,

    load: function() {
        map.map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: -34.397, lng: 150.644},
            scrollwheel: false,
            disableDefaultUI: true,
            mapTypeControl: true,
            mapTypeId: google.maps.MapTypeId.SATELLITE,
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

var request = {
    url: 'http://192.168.33.10:3000/',

    get: function(resource, cb) {
        this.send('get', resource, cb)
    },

    post: function(resource, data, cb) {
        this.send('post', resource, cb, data)
    },

    send: function(type, resource, cb, data) {
        var o = {
            type: type,
            url: this.url + resource,
            success: cb
        };

        if(data) {
            o.data = { "tag": data };
        }

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