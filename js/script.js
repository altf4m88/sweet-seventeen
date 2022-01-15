const scene = new THREE.Scene();

const TL = new TimelineMax();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 2;
renderer.shadowMap.enabled = true;

camera.position.setZ(15);
camera.position.setY(10);
camera.position.setX(0);

renderer.render(scene, camera);

scene.background = new THREE.Color(0xdddddd)

let hemisphereLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 4);

scene.add(hemisphereLight);

let spotLight = new THREE.SpotLight(0xffa95c, 6);
spotLight.position.set(-50,50,50);
spotLight.castShadow = true;
spotLight.shadow.bias = -0.0001;
spotLight.shadow.mapSize.width = 1024*4;
spotLight.shadow.mapSize.height = 1024*4;
scene.add(spotLight);

let loader = new THREE.GLTFLoader();
loader.crossOrigin = true;
loader.load( 'models/cake_3d/scene.gltf', function ( data ) {
    var object = data.scene;
    object.position.set(0, 5, 0);
    object.rotation.set(Math.PI / 15, 11, -0.4);

    object.traverse(n => { if ( n.isMesh ) {
        n.castShadow = true; 
        n.receiveShadow = true;
        if(n.material.map) n.material.map.anisotropy = 16; 
    }});

    
    scene.add( object );
});

const loadHeart = () => {
    loader.load( 'models/low_poly_spinning_heart/scene.gltf', function ( data ) {
        let object = data.scene;
    
        object.traverse(n => { if ( n.isMesh ) {
            n.castShadow = true; 
            n.receiveShadow = true;
            if(n.material.map) n.material.map.anisotropy = 16; 
        }});
    
        const [x, y] = Array(3)
        .fill()
        .map(() => THREE.MathUtils.randFloatSpread(40));

        let randomNum = Math.floor((Math.random() * 10) + 3);
        let randomZ = Math.floor((Math.random() * -10) - 18);
    
        object.position.set(x, y, randomZ);
        TweenMax.fromTo(object.position, randomNum,
            {
                y: y - 30,
                yoyo: true,
                repeat: -1,
                ease: 'Power2.easeInOut'
            },
            {
                y: Math.floor((Math.random() * 20)),
                yoyo: true,
                repeat: -1,
                ease: 'Power2.easeInOut'
            }
        );
        scene.add( object );
    });
}

Array(20).fill().forEach(loadHeart);

let composer = new POSTPROCESSING.EffectComposer(renderer);
composer.addPass(new POSTPROCESSING.RenderPass(scene, camera));

let bloom = new POSTPROCESSING.BloomEffect();
bloom.intensity = 1.5;
bloom.luminanceThreshold = 0.5
bloom.luminanceSmoothing = 0

const effectPass = new POSTPROCESSING.EffectPass(
    camera,
    bloom
);
effectPass.renderToScreen = true;
composer.addPass(effectPass);

const controls = new THREE.OrbitControls(camera, renderer.domElement);

controls.rotateSpeed = 0.3;
controls.zoomSpeed = 0.9;

controls.minDistance = 10;
controls.maxDistance = 20;

controls.minPolarAngle = 0; // radians
controls.maxPolarAngle = Math.PI /2; // radians

controls.enableDamping = true;
controls.dampingFactor = 0.05;

function animate() {
    composer.render();
    requestAnimationFrame(animate);

    spotLight.position.set(
        camera.position.x + 10,
        camera.position.y + 10,
        camera.position.z + 10,
    )
    controls.update()
}

animate();