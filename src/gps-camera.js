AFRAME.registerComponent('gps-camera', {
    _watchPositionId: null,
    originCoords: null,
    currentCoords: null,
    lookControls: null,
    heading: null,

    schema: {
        positionMinAccuracy: {
            type: 'int',
            default: 100,
        },
        alert: {
            type: 'boolean',
            default: false,
        },
        minDistance: {
            type: 'int',
            default: 0,
        }
    },

    init: function () {
        if (this.el.components['look-controls'] === undefined) {
            return;
        }

        this.lookControls = this.el.components['look-controls'];

        var eventName = this._getDeviceOrientationEventName();
        this._onDeviceOrientation = this._onDeviceOrientation.bind(this);

        if (!!navigator.userAgent.match(/Version\/[\d.]+.*Safari/)) {
            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                var handler = function() {
                    console.log('Requesting device orientation permissions...')
                    DeviceOrientationEvent.requestPermission();
                    document.removeEventListener('touchend', handler);
                };

                document.addEventListener('touchend', function() { handler() }, false);

                alert('After camera permission prompt, please tap the screen to active geolocation.');
            } else {
                var timeout = setTimeout(function () {
                    alert('Please enable device orientation in Settings > Safari > Motion & Orientation Access.')
                }, 750);
                window.addEventListener(eventName, function () {
                    clearTimeout(timeout);
                });
            }
        }

        window.addEventListener(eventName, this._onDeviceOrientation, false);

        this._watchPositionId = this._initWatchGPS(function (position) {
            this.currentCoords = position.coords;
            this._updatePosition();
        }.bind(this));
    },

    tick: function () {
        if (this.heading === null) {
            return;
        }
        this._updateRotation();
    },

    remove: function () {
        if (this._watchPositionId) {
            navigator.geolocation.clearWatch(this._watchPositionId);
        }
        this._watchPositionId = null;

        var eventName = this._getDeviceOrientationEventName();
        window.removeEventListener(eventName, this._onDeviceOrientation, false);
    },

    /**
            _getDeviceOrientationEventName: function () {
            _getDeviceOrientationEventName: function () {
                if ('ondeviceorientationabsolute' in window) {
                    var eventName = 'deviceorientationabsolute'
                } else if ('ondeviceorientation' in window) {
                    var eventName = 'deviceorientation'
                } else {
                    var eventName = ''
                    console.error('Compass not supported')
                }

                return eventName
            },

            _initWatchGPS: function (onSuccess, onError) {
                if (!onError) {
                    onError = function (err) {
                        console.warn('ERROR(' + err.code + '): ' + err.message)

                        if (err.code === 1) {
                            alert('Please activate Geolocation and refresh the page. If it is already active, please check permissions for this website.');
                            return;
                        }

                        if (err.code === 3) {
                            alert('Cannot retrieve GPS position. Signal is absent.');
                            return;
                        }
                    };
                }

                if ('geolocation' in navigator === false) {
                    onError({ code: 0, message: 'Geolocation is not supported by your browser' });
                    return Promise.resolve();
                }

                return navigator.geolocation.watchPosition(onSuccess, onError, {
                    enableHighAccuracy: true,
                    maximumAge: 0,
                    timeout: 27000,
                });
            },

            _updatePosition: function () {
                if (this.currentCoords.accuracy > this.data.positionMinAccuracy) {
                    if (this.data.alert && !document.getElementById('alert-popup')) {
                        var popup = document.createElement('div');
                        popup.innerHTML = 'GPS signal is very poor. Try move outdoor or to an area with a better signal.'
                        popup.setAttribute('id', 'alert-popup');
                        document.body.appendChild(popup);
                    }
                    return;
                }

                var alertPopup = document.getElementById('alert-popup');
                if (this.currentCoords.accuracy <= this.data.positionMinAccuracy && alertPopup) {
                    document.body.removeChild(alertPopup);
                }

                if (!this.originCoords) {
                    this.originCoords = this.currentCoords;
                }

                var position = this.el.getAttribute('position');

                var dstCoords = {
                    longitude: this.currentCoords.longitude,
                    latitude: this.originCoords.latitude,
                };
                position.x = this.computeDistanceMeters(this.originCoords, dstCoords);
                position.x *= this.currentCoords.longitude > this.originCoords.longitude ? 1 : -1;

                var dstCoords = {
                    longitude: this.originCoords.longitude,
                    latitude: this.currentCoords.latitude,
                }
                position.z = this.computeDistanceMeters(this.originCoords, dstCoords);
                position.z *= this.currentCoords.latitude > this.originCoords.latitude ? -1 : 1;

                this.el.setAttribute('position', position);
            },

            computeDistanceMeters: function (src, dest, isPlace) {
                var dlongitude = THREE.Math.degToRad(dest.longitude - src.longitude);
                var dlatitude = THREE.Math.degToRad(dest.latitude - src.latitude);

                var a = (Math.sin(dlatitude / 2) * Math.sin(dlatitude / 2)) + Math.cos(THREE.Math.degToRad(src.latitude)) * Math.cos(THREE.Math.degToRad(dest.latitude)) * (Math.sin(dlongitude / 2) * Math.sin(dlongitude / 2));
                var angle = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                var distance = angle * 6378160;

                if (isPlace && this.data.minDistance && this.data.minDistance > 0 && distance < this.data.minDistance) {
                    return Number.MAX_SAFE_INTEGER;
                }

                return distance;
            },

            _computeCompassHeading: function (alpha, beta, gamma) {
                var alphaRad = alpha * (Math.PI / 180);
                var betaRad = beta * (Math.PI / 180);
                var gammaRad = gamma * (Math.PI / 180);

                var cA = Math.cos(alphaRad);
                var sA = Math.sin(alphaRad);
                var sB = Math.sin(betaRad);
                var cG = Math.cos(gammaRad);
                var sG = Math.sin(gammaRad);

                var rA = - cA * sG - sA * sB * cG;
                var rB = - sA * sG + cA * sB * cG;

                var compassHeading = Math.atan(rA / rB);

                if (rB < 0) {
                    compassHeading += Math.PI;
                } else if (rA < 0) {
                    compassHeading += 2 * Math.PI;
                }

                compassHeading *= 180 / Math.PI;

                return compassHeading;
            },

            _onDeviceOrientation: function (event) {
                if (event.webkitCompassHeading !== undefined) {
                    if (event.webkitCompassAccuracy < 50) {
                        this.heading = event.webkitCompassHeading;
                    } else {
                        console.warn('webkitCompassAccuracy is event.webkitCompassAccuracy');
                    }
                } else if (event.alpha !== null) {
                    if (event.absolute === true || event.absolute === undefined) {
                        this.heading = this._computeCompassHeading(event.alpha, event.beta, event.gamma);
                    } else {
                        console.warn('event.absolute === false');
                    }
                } else {
                    console.warn('event.alpha === null');
                }
            },

            _updateRotation: function () {
                var heading = 360 - this.heading;
                var cameraRotation = this.el.getAttribute('rotation').y;
                var yawRotation = THREE.Math.radToDeg(this.lookControls.yawObject.rotation.y);
                var offset = (heading - (cameraRotation - yawRotation)) % 360;
                this.lookControls.yawObject.rotation.y = THREE.Math.degToRad(offset);
            },
