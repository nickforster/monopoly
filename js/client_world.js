let container, scene, camera, renderer, plane;
let player;
let players = [];
let objects = [];
let positions;

const fetchData = async () => {
    try {
        const res = await fetch('../data/fields.json');
        positions = await res.json();
    } catch (e) {
        console.log("something went wrong!", e);
    }
};
fetchData();


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
        camera.position.y = 18;
        camera.lookAt(0, 0, 0)

        renderer = new THREE.WebGLRenderer({alpha: true});
        renderer.setSize(window.innerWidth, window.innerHeight);

        //Sphere in the middle
        let plane_geometry = new THREE.PlaneGeometry(13, 13);
        let plane_material = new THREE.MeshBasicMaterial({color: '#ADD8E6'});
        plane = new THREE.Mesh(plane_geometry, plane_material);
        plane.position.set(0, 0, 0)
        plane.rotation.x = (-Math.PI / 2);
        plane.rotation.z = (-Math.PI / 2);
        scene.add(plane);

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
        let cube_geometry = new THREE.BoxGeometry(0.35, 0.35, 0.35);
        let cube_material = new THREE.MeshBasicMaterial({color: 0x00b72f});
        player = new THREE.Mesh(cube_geometry, cube_material);

        objects[i] = player
        scene.add(objects[i]);

        player = {
            "id": Object.keys(roomData)[i],
            "name": Object.values(roomData)[i],
            "positionID": 0,
            "places": []
        }

        players[i] = player;
    }
    updatePlayerPositions(roomData)
}

/*
 * updates the positions of all players based on their positionId and the fields.json file data
 * @param roomData
 */
function updatePlayerPositions(roomData) {
    for (let i = 0; i < Object.keys(roomData).length; i++) {
        player = players[i]
        let playerPositionField = player["positionID"]
        let newPositions = positions[playerPositionField]

        objects[i].position.set(newPositions["x"], 0, newPositions["z"])

    }
    testCollision(roomData)
}

/*
 * Tests if there is a collision between two or more players (on the same field)
 * If yes, the position of the players will be slightly shifted.
 * @param roomData
 */
function testCollision(roomData) {
    let shifts = [
        {
            "x": 0.275,
            "z": 0.275
        },
        {
            "x": 0.275,
            "z": -0.275
        },
        {
            "x": -0.275,
            "z": 0.275
        },
        {
            "x": -0.275,
            "z": -0.275
        }
    ]
    let collisions = [];
    let player1;
    for (let i = 0; i < Object.keys(roomData).length - 1; i++) {
        for (let j = 0; j < Object.keys(roomData).length - (i + 1); j++) {
            player = players[j]
            player1 = players[j+1]
            if (player["positionID"] === player1["positionID"]) {
                if (!collisions.includes(collisions[j])) {
                    collisions.push(j)
                }
                if (!collisions.includes(collisions[j+1])) {
                    collisions.push(j+1)
                }
            }
        }
    }

    for (let i = 0; i < Math.min(collisions.length, Object.keys(roomData).length); i++) {
        let newPosition = shifts[i]
        objects[collisions[i]].position.set(objects[collisions[i]].position.x + newPosition["x"], 0, objects[collisions[i]].position.z + newPosition["z"])
    }
}
