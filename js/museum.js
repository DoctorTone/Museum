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
        this.rotating = false;
        this.wireframe = false;
        this.rotateSpeed = 0.05*Math.PI;
        this.moveSpeed = 0.1;
        this.rotatingUp = false;
        this.rotatingDown = false;
        this.zoomingIn = false;
        this.zoomingOut = false;
    }

    createScene() {
        //Create scene
        super.createScene();

        //Load in model
        let modelConfig = {
            SCALE_X : 30,
            SCALE_Y : 30,
            SCALE_Z : 30,
            POS_X : 0,
            POS_Y : 0,
            POS_Z : 0
        };
        let mtlLoader = new THREE.MTLLoader();
        mtlLoader.setPath("./models/");
        mtlLoader.load("Barbute.mtl", materials => {
            materials.preload();

            let objLoader = new THREE.OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.setPath("./models/");
            objLoader.load("Barbute.obj", object => {
                this.addToScene(object);
                this.rotateObject = object;
                this.rotateMesh = this.rotateObject.children[0];
                this.rotateObject.position.set(modelConfig.POS_X, modelConfig.POS_Y, modelConfig.POS_Z);
                this.rotating = true;
                this.createInfoPoints();
            })
        });
    }

    createInfoPoints() {
        let infoConfig = {
            INFO_SCALE_X : 0.00025,
            INFO_SCALE_Y : 0.00025,
            INFO_SCALE_Z : 1
        };
        let infoPositions = [];
        infoPositions.push(new THREE.Vector3(-0.085, 0.1, 0.05));
        infoPositions.push(new THREE.Vector3(0, 0.04, 0.135));
        infoPositions.push(new THREE.Vector3(0.11, -0.1, -0.0));
        let textureLoader = new THREE.TextureLoader();
        textureLoader.load("textures/infoBlueWhite.png", texture => {
            let infoMaterial = new THREE.SpriteMaterial( {map: texture, color: 0xffffff} );
            let width = infoMaterial.map.image.width;
            let height = infoMaterial.map.image.height;
            let infoSprite;
            for(let i=0, numPoints=infoPositions.length; i<numPoints; ++i) {
                infoSprite = new THREE.Sprite(infoMaterial);
                infoSprite.position.copy(infoPositions[i]);
                infoSprite.scale.set(width * infoConfig.INFO_SCALE_X, height * infoConfig.INFO_SCALE_Y, 1);
                this.rotateObject.add(infoSprite);
            }
        });
    }

    createGUI() {

    }

    update() {
        let delta = this.clock.getDelta();

        if(this.rotating) {
            this.rotateObject.rotation.y += this.rotateSpeed * delta;
        }

        if(this.rotatingUp) {
            this.rotateObject.rotation.x -= this.rotateSpeed * delta;
        }

        if(this.rotatingDown) {
            this.rotateObject.rotation.x += this.rotateSpeed * delta;
        }

        if(this.zoomingIn) {
            this.rotateObject.position.z += this.moveSpeed * delta;
        }

        if(this.zoomingOut) {
            this.rotateObject.position.z -= this.moveSpeed * delta;
        }

        super.update();
    }

    toggleRotation() {
        this.rotating = !this.rotating;
    }

    toggleWireframe() {
        this.wireframe = !this.wireframe;
        this.rotateObject.traverse( child => {
            if(child instanceof THREE.Mesh) {
                for(let mat=0,numMats=child.material.length; mat<numMats; ++mat) {
                    child.material[mat].wireframe = this.wireframe;
                }
            }
        });
    }

    rotateUp(rotate) {
        this.rotatingUp = rotate;
    }

    rotateDown(rotate) {
        this.rotatingDown = rotate;
    }

    zoomIn(zoom) {
        this.zoomingIn = zoom;
    }

    zoomOut(zoom) {
        this.zoomingOut = zoom;
    }

    reset() {
        //Return object to default orientation
        this.rotateObject.position.set(0, 0, 0);
        this.rotateObject.rotation.set(0, 0, 0);
        this.wireframe = true;
        this.toggleWireframe();
        this.rotating = true;
        $('#toggleRotation').prop("checked", true);
        $('#toggleWire').prop("checked", false);
    }
}

$(document).ready( ()=> {
    //Init museum
    let container = document.getElementById("WebGL-output");

    let app = new MuseumApp();
    app.init(container);
    //app.createGUI();
    app.createScene();

    $('#toggleRotation').on("change", () => {
        app.toggleRotation();
    });

    $('#toggleWire').on("change", () => {
        app.toggleWireframe();
    });

    $('#rotUp').on("mousedown", () => {
        app.rotateUp(true);
    });

    $('#rotUp').on("mouseup", () => {
        app.rotateUp(false);
    });

    $('#rotDown').on("mousedown", () => {
        app.rotateDown(true);
    });

    $('#rotDown').on("mouseup", () => {
        app.rotateDown(false);
    });

    $('#zoomIn').on("mousedown", () => {
        app.zoomIn(true);
    });

    $('#zoomIn').on("mouseup", () => {
        app.zoomIn(false);
    });

    $('#zoomOut').on("mousedown", () => {
        app.zoomOut(true);
    });

    $('#zoomOut').on("mouseup", () => {
        app.zoomOut(false);
    });

    $('#reset').on("click", () => {
        app.reset();
    });

    app.run();
});