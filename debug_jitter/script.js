window.onload = function() {
    const scene = document.querySelector('a-scene');
    
    scene.addEventListener('loaded', function() {
        staticLoadPlaces();
    });
};

function staticLoadPlaces() {
    const place = {
        name: "DareMapp Logo",
        // oficina
        latitude: 40.65594412076483,
        longitude: -4.699638143293775,
        model: "../examples/assets/map-marker.png", // Fallback to existing asset for demo if GLB missing
        scale: "15 15 15",
        rotation: "0 0 0"
    };

    // Note: User originally pointed to "./assets/daremapp/daremapp_logo.glb"
    // Validating if that exists or using a placeholder is important.
    // For this debug file, checking if we can use a primitive to ensure visibility if model fails.
    
    const scene = document.querySelector('a-scene');
    
    const entity = document.createElement('a-entity');
    entity.setAttribute('id', 'daremapp-logo');
    
    // Using a box as fallback visual if model fails loading
    // entity.setAttribute('geometry', 'primitive: box');
    // entity.setAttribute('material', 'color: red');
    
    // Keep user's model logic but be aware of pathing
    // We are in /debug_jitter/, so assets are likely ../assets/
    // The user had "./assets/daremapp/daremapp_logo.glb"
    // Assuming root of workspace has assets. 
    
    entity.setAttribute('gltf-model', place.model); // Trying to use the user's path or a fallback
    
    // Changing model to box for guaranteed visibility in test
    entity.removeAttribute('gltf-model');
    entity.setAttribute('geometry', 'primitive: box');
    entity.setAttribute('material', 'color: red');
    
    entity.setAttribute('gps-entity-place', `latitude: ${place.latitude}; longitude: ${place.longitude};`);

    entity.setAttribute('scale', place.scale);
    entity.setAttribute('rotation', place.rotation);
    
    scene.appendChild(entity);
    
    entity.addEventListener('loaded', function() {
        freezePositionAfterDelay(entity, 5000);
    });
}

function freezePositionAfterDelay(entity, delay) {
    setTimeout(function() {
        const currentPosition = entity.getAttribute('position');
        
        const frozenPos = {
            x: currentPosition.x,
            y: currentPosition.y,
            z: currentPosition.z
        };

        const observer = new MutationObserver(function(mutations) {
            const newPos = entity.getAttribute('position');
            if (newPos.x !== frozenPos.x || newPos.y !== frozenPos.y || newPos.z !== frozenPos.z) {
                entity.setAttribute('position', frozenPos);
            }
        });
        
        observer.observe(entity, { 
            attributes: true, 
            attributeFilter: ['position'] 
        });
        
        alert("GPS position frozen");
        
    }, delay);
}
