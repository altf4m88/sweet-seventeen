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
camera.position.setX(0);

renderer.render(scene, camera);

//background
const grayBackground = new THREE.TextureLoader().load('./img/gray.jpg');
scene.background = new THREE.Color(0xdddddd)

// //lightning
// let light = new THREE.PointLight( 0xffffcc, 10, 300 );
// light.position.set( 300, 400, -20 );
// // scene.add( light );

// let light2 = new THREE.AmbientLight( 0x20202A, 10, 300 );
// light2.position.set( 30, -10, 30 );
// scene.add( light2 );

let hemisphereLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 4);
scene.add(hemisphereLight);

let spotLight = new THREE.SpotLight(0xffa95c, 4);
spotLight.position.set(-50,50,50);
spotLight.castShadow = true;
spotLight.shadow.bias = -0.0001;
spotLight.shadow.mapSize.width = 1024*4;
spotLight.shadow.mapSize.height = 1024*4;
scene.add(spotLight);

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

    // TweenLite.from( object.rotation, 1.3, {
    //   y: Math.PI * 2,
    //   ease: 'Power3.easeOut'
    // });

    // TweenMax.from( object.position, 3, {
    // y: -8,
    // yoyo: true,
    // repeat: -1,
    // ease: 'Power2.easeInOut'
    // });
    // object.position.y = - 95;
//, onProgress, onError );
});

function animate() {
    requestAnimationFrame(animate);

    spotLight.position.set(
        camera.position.x + 10,
        camera.position.x + 10,
        camera.position.x + 10,
    )
    renderer.render(scene, camera);
}

animate();