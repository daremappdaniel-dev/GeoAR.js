const ensureFoursquareConfig = function() {
    if (typeof window.CONFIG === 'object' && window.CONFIG.CLIENT_ID && window.CONFIG.CLIENT_SECRET) {
        return window.CONFIG;
    }

    const clientId = window.prompt('Foursquare Client ID:');
    const clientSecret = window.prompt('Foursquare Client Secret:');
    window.CONFIG = window.CONFIG || {};
    window.CONFIG.CLIENT_ID = clientId;
    window.CONFIG.CLIENT_SECRET = clientSecret;
    return window.CONFIG;
};

const loadPlaces = function (coords) {
    const method = 'api';

    const PLACES = [
        {
            name: "Your place name",
            location: {
                lat: 0,
                lng: 0,
            }
        },
    ];

    if (method === 'api') {
        return loadPlaceFromAPIs(coords);
    }

    return Promise.resolve(PLACES);
};

function loadPlaceFromAPIs(position) {
    const cfg = ensureFoursquareConfig();
    const params = {
        radius: 300,
        clientId: cfg.CLIENT_ID,
        clientSecret: cfg.CLIENT_SECRET,
        version: '20300101',
    };

    const corsProxy = 'https://cors-anywhere.herokuapp.com/';

    const endpoint = `${corsProxy}https://api.foursquare.com/v2/venues/search?intent=checkin&ll=${position.latitude},${position.longitude}&radius=${params.radius}&client_id=${params.clientId}&client_secret=${params.clientSecret}&limit=15&v=${params.version}`;
    return fetch(endpoint)
        .then((res) => {
            return res.json()
                .then((resp) => {
                    return resp.response.venues;
                })
        })
        .catch((err) => {
            console.error('Error with places API', err);
        })
};


window.onload = () => {
    const scene = document.querySelector('a-scene');

    return navigator.geolocation.getCurrentPosition(function (position) {

        loadPlaces(position.coords)
            .then((places) => {
                places.forEach((place) => {
                    const latitude = place.location.lat;
                    const longitude = place.location.lng;

                    const text = document.createElement('a-link');
                    text.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
                    text.setAttribute('title', place.name);
                    text.setAttribute('href', 'http://www.example.com/');
                    text.setAttribute('scale', '20 20 20');

                    text.addEventListener('loaded', () => {
                        window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
                    });

                    scene.appendChild(text);
                });
            })
    },
        (err) => console.error('Error in retrieving position', err),
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 27000,
        }
    );
};
