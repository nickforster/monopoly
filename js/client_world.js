let container, scene, camera, renderer, sphere;
let player;

let loadWorld = function () {

    init();
    tick();

    /*
     * The setup of the scene
     */
    function init() {
        container = document.getElementById('container');

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 10;

        renderer = new THREE.WebGLRenderer({alpha: true});
        renderer.setSize(window.innerWidth, window.innerHeight);

        //Sphere in the middle
        let sphere_geometry = new THREE.SphereGeometry(1);
        let sphere_material = new THREE.MeshNormalMaterial();
        sphere = new THREE.Mesh(sphere_geometry, sphere_material);

        scene.add(sphere);

        //When the window is being resized, the game adjusts
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        container.appendChild(renderer.domElement);
        document.body.appendChild(container);
    }

    /*
     * Updates the renderer every tick
     */
    function tick() {
        requestAnimationFrame(tick);

        renderer.clear();
        renderer.render(scene, camera);
    }

};

/*
 * creates all players in the room and adds them to the scene
 * @param roomData
 */
function createPlayers(roomData) {
    for (let i = 0; i < Object.keys(roomData).length; i++) {
        let cube_geometry = new THREE.BoxGeometry(1, 1, 1);
        let cube_material = new THREE.MeshBasicMaterial({color: 0x00b72f});
        player = new THREE.Mesh(cube_geometry, cube_material);

        player.position.set(0, (i + 1) * 2, 0);

        scene.add(player);
    }
}