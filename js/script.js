const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 2.3;
renderer.shadowMap.enabled = true;

camera.position.setZ(5);
camera.position.setY(0);
camera.position.setX(0);

renderer.render(scene, camera);

//background
const grayBackground = new THREE.TextureLoader().load('./img/gray.jpg');
scene.background = new THREE.Color(0xdddddd)

//lightning
// let light = new THREE.PointLight( 0xffffcc, 20, 1000 );
// light.position.set( 15, 15, -30 );
// scene.add( light );

// const sphereSize = 1;
// const pointLightHelper = new THREE.PointLightHelper( light, sphereSize );
// scene.add( pointLightHelper );

// let light2 = new THREE.AmbientLight( 0x20202A, 10, 300 );
// light2.position.set( 10, 30, 50 );
// scene.add( light2 );

let hemisphereLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 4);

scene.add(hemisphereLight);

// const helper = new THREE.HemisphereLightHelper( hemisphereLight, 5 );
// scene.add( helper );

// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(gridHelper)

let spotLight = new THREE.SpotLight(0xffa95c, 6);
spotLight.position.set(-50,50,50);
spotLight.castShadow = true;
spotLight.shadow.bias = -0.0001;
spotLight.shadow.mapSize.width = 1024*4;
spotLight.shadow.mapSize.height = 1024*4;
scene.add(spotLight);

// const spotLightHelper = new THREE.SpotLightHelper( spotLight );
// scene.add( spotLightHelper );

let loader = new THREE.GLTFLoader();
loader.crossOrigin = true;
loader.load( '../models/cake_3d/scene.gltf', function ( data ) {
    var object = data.scene;
    object.position.set(0, -4, -10);
    object.rotation.set(Math.PI / 15, 11, 0);

    object.traverse(n => { if ( n.isMesh ) {
        n.castShadow = true; 
        n.receiveShadow = true;
        if(n.material.map) n.material.map.anisotropy = 16; 
    }});

    
    scene.add( object );
});

const loadHeart = () => {
    loader.load( '../models/low_poly_spinning_heart/scene.gltf', function ( data ) {
        var object = data.scene;
    
        object.traverse(n => { if ( n.isMesh ) {
            n.castShadow = true; 
            n.receiveShadow = true;
            if(n.material.map) n.material.map.anisotropy = 16; 
        }});
    
        const [x, y] = Array(3)
        .fill()
        .map(() => THREE.MathUtils.randFloatSpread(40));
    
        object.position.set(x, y, -15);
        scene.add( object );
    });
}

Array(10).fill().forEach(loadHeart);

let composer = new POSTPROCESSING.EffectComposer(renderer);
composer.addPass(new POSTPROCESSING.RenderPass(scene, camera));

let bloom = new POSTPROCESSING.BloomEffect();
bloom.intensity = 1.5;
bloom.luminanceThreshold = 0.5
bloom.luminanceSmoothing = 0
// bloom.kernelSize = 0.5

const effectPass = new POSTPROCESSING.EffectPass(
    camera,
    bloom
);
effectPass.renderToScreen = true;
composer.addPass(effectPass);

// const controls = new THREE.OrbitControls(camera, renderer.domElement);

function animate() {
    composer.render();
    requestAnimationFrame(animate);

    spotLight.position.set(
        camera.position.x + 10,
        camera.position.y + 10,
        camera.position.z + 10,
    )
    // controls.update()
    // renderer.render(scene, camera);
}

animate();