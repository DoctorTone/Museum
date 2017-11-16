/**
 * Created by DrTone on 10/04/2017.
 */

//App for interactive artefact display
const MOBILE_WIDTH = 768;

class MuseumApp extends BaseApp {
    constructor() {
        super();
    }

    init(container) {
        super.init(container);
        this.rotating = false;
        this.wireframe = false;
        this.rotateObject = undefined;
        this.rotateSpeed = 0.05*Math.PI;
        this.moveSpeed = 0.1;
        this.rotatingUp = false;
        this.rotatingDown = false;
        this.zoomingIn = false;
        this.zoomingOut = false;
        this.labelsVisible = false;
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
        let infoPoints = [
            {
                text : ["15th century Italian design.", "  Typically made of steel."],
                POS_X : -0.085,
                POS_Y : 0.1,
                POS_Z : 0.05,
                LABEL_OFFSET_X : -0.06,
                LABEL_OFFSET_Y : 0.02,
                LABEL_OFFSET_Z : 0.01
            },
            {
                text : ["T-shaped opening for eyes and mouth.", "    Weighed between 3 and 4 pounds"],
                POS_X : 0,
                POS_Y : 0.04,
                POS_Z : 0.135,
                LABEL_OFFSET_X : 0,
                LABEL_OFFSET_Y : 0.025,
                LABEL_OFFSET_Z : 0.01
            },
            {
                text : ["Covered both sides of user's face and neck.", "  Allows wearing of stiffened mail collar."],
                POS_X : 0.11,
                POS_Y : -0.1,
                POS_Z : 0,
                LABEL_OFFSET_X : 0.05,
                LABEL_OFFSET_Y : 0.03,
                LABEL_OFFSET_Z : 0.01
            }
        ];
        let infoConfig = {
            INFO_SCALE_X : 0.00025,
            INFO_SCALE_Y : 0.00025,
            INFO_SCALE_Z : 1
        };
        let labelConfig = {
            signLabelScaleX: 0.135,
            signLabelScaleY: 0.045
        };

        let infoPosition, labelOffset = new THREE.Vector3();
        let textureLoader = new THREE.TextureLoader();
        textureLoader.load("textures/infoBlueWhite.png", texture => {
            let infoMaterial = new THREE.SpriteMaterial( {map: texture, color: 0xffffff} );
            let width = infoMaterial.map.image.width;
            let height = infoMaterial.map.image.height;
            let info, infoSprite, label;
            let labelScale = new THREE.Vector3(labelConfig.signLabelScaleX, labelConfig.signLabelScaleY, 1);
            for(let i=0, numPoints=infoPoints.length; i<numPoints; ++i) {
                infoSprite = new THREE.Sprite(infoMaterial);
                infoSprite.name = "infoSprite" + i;
                info = infoPoints[i];
                infoPosition = new THREE.Vector3(info.POS_X, info.POS_Y, info.POS_Z);
                infoSprite.position.copy(infoPosition);
                infoSprite.scale.set(width * infoConfig.INFO_SCALE_X, height * infoConfig.INFO_SCALE_Y, 1);
                this.rotateObject.add(infoSprite);
                //Create text as well
                labelOffset.copy(infoPosition);
                labelOffset.x += info.LABEL_OFFSET_X;
                labelOffset.y += info.LABEL_OFFSET_Y;
                labelOffset.z += info.LABEL_OFFSET_Z;
                label = spriteManager.create(info.text, labelOffset, labelScale, 32, 1, false, true);
                this.rotateObject.add(label);
            }
        });
    }

    hideLabels() {
        spriteManager.hideLabels();
        this.labelsVisible = false;
        if(this.rotateObject) {
            this.rotating = true;
        }
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

        if(this.mouseUpdated) {
            this.mouseUpdated = false;
            this.labelsVisible = false;
            this.selectedName = undefined;
            if(this.selectedObject) {
                let name = this.selectedObject.name;
                if(name.indexOf("infoSprite") >= 0) {
                    console.log("Clicked ", name);
                    this.labelsVisible = true;
                    this.selectedName = name;
                }
                this.selectedObject = undefined;
            }

            if(this.labelsVisible) {
                let infoNum = this.selectedName.match(/\d/g);
                infoNum = infoNum.join("");
                infoNum = parseInt(infoNum, 10);
                let label = spriteManager.getSpriteByIndex(infoNum);
                if(label) {
                    label.visible = true;
                    this.rotating = false;
                }
                $('#noticeText').html("Click anywhere to continue");
            } else {
                this.hideLabels();
                $('#noticeText').html("Click info icons!");
            }
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

    if(window.innerWidth < MOBILE_WIDTH) {
        $('#mainModal').modal();
    }

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

    $('#noticeText').html("Click info icons!");

    $('#info').on("click", () => {
        $('#myModal').modal();
    });

    app.run();
});