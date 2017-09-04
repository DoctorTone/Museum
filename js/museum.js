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
        let mtlLoader = new THREE.MTLLoader();
        mtlLoader.setPath("./models/");
        mtlLoader.load("Barbute1.mtl", materials => {
            materials.preload();

            let objLoader = new THREE.OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.setPath("./models/");
            objLoader.load("Barbute1.obj", object => {
                object.scale.set(modelConfig.SCALE_X, modelConfig.SCALE_Y, modelConfig.SCALE_Z);
                object.rotation.y = Math.PI/4;
                this.addToScene(object);
            })
        })
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