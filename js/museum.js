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

        //Load in model
        let loader = new THREE.JSONLoader();
        let modelConfig = {
            SCALE_X : 30,
            SCALE_Y : 30,
            SCALE_Z : 30
        };
        loader.load("./models/Barbute.json", (geometry, materials) => {
            let mesh = new THREE.Mesh(geometry, new THREE.MultiMaterial(materials));
            mesh.scale.set(modelConfig.SCALE_X, modelConfig.SCALE_Y, modelConfig.SCALE_Z);
            this.addToScene(mesh);
        });
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