/**
 * Created by DrTone on 10/04/2017.
 */

//App for interactive artefact display

class MuseumApp extends BaseApp {
    constructor() {
        super();
    }

    init(container) {
        super.init(container);
    }

    createScene() {
        //Create scene
        super.createScene();

        //Simple geometry
        let boxGeom = new THREE.BoxBufferGeometry(10, 10, 10);
        let boxMat = new THREE.MeshLambertMaterial( {color: 0xff0000} );
        let boxMesh = new THREE.Mesh(boxGeom, boxMat);
        this.scenes[this.currentScene].add(boxMesh);
    }

    update() {
        super.update();
    }
}

$(document).ready( ()=> {
    //Init museum
    let container = document.getElementById("WebGL-output");

    let app = new MuseumApp();
    app.init(container);
    //app.createGUI();
    app.createScene();

    app.run();
});