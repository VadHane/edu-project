import * as THREE from 'three';
import {
    DEFAULT_ANGLE_X,
    DEFAULT_ANGLE_Y,
    INITIAL_CAMERA_POSITION,
    ROTATION_ANGLE,
    ZOOM_STEP_DECREMENT,
    ZOOM_STEP_INCREMENT,
} from './OrbitControls.constants';
import {
    arrowX,
    arrowY,
    arrowZ,
    ellipseX,
    ellipseY,
    ellipseZ,
} from './OrbitControls.units';

const rotate = (angleX: number, angleY: number) => {
    const matrix = [
        [Math.cos(angleX), 0, Math.sin(angleX)],
        [
            -Math.sin(angleX) * -Math.sin(angleY),
            Math.cos(angleY),
            -Math.sin(angleY) * Math.cos(angleX),
        ],
        [
            Math.cos(angleY) * -Math.sin(angleX),
            Math.sin(angleY),
            Math.cos(angleX) * Math.cos(angleY),
        ],
    ];

    return new THREE.Vector3(
        INITIAL_CAMERA_POSITION.x * matrix[0][0] +
            INITIAL_CAMERA_POSITION.y * matrix[1][0] +
            INITIAL_CAMERA_POSITION.z * matrix[2][0],
        INITIAL_CAMERA_POSITION.x * matrix[0][1] +
            INITIAL_CAMERA_POSITION.y * matrix[1][1] +
            INITIAL_CAMERA_POSITION.z * matrix[2][1],
        INITIAL_CAMERA_POSITION.x * matrix[0][2] +
            INITIAL_CAMERA_POSITION.y * matrix[1][2] +
            INITIAL_CAMERA_POSITION.z * matrix[2][2],
    );
};

export class OrbitControls extends THREE.EventDispatcher {
    camera: THREE.OrthographicCamera | THREE.PerspectiveCamera;
    domElement: HTMLCanvasElement;
    scene: THREE.Scene;
    model: THREE.Group;

    angleX: number;
    angleY: number;
    rotationAngle: number;

    modelMoveStep: number;
    modelRotateStep: number;

    raycaster: THREE.Raycaster;
    selectedObject: THREE.Object3D<THREE.Event> | undefined;

    lastMousePosition: THREE.Vector2;

    onPointerDown: (event: PointerEvent) => void;
    onMouseWheel: (event: WheelEvent) => void;

    constructor(
        camera: THREE.OrthographicCamera | THREE.PerspectiveCamera,
        domElement: HTMLCanvasElement,
        scene: THREE.Scene,
        model: THREE.Group,
    ) {
        super();

        this.camera = camera;
        this.domElement = domElement;
        this.scene = scene;
        this.model = model;

        this.angleX = DEFAULT_ANGLE_X;
        this.angleY = DEFAULT_ANGLE_Y;
        this.rotationAngle = ROTATION_ANGLE;

        this.modelMoveStep = 0.1;
        this.modelRotateStep = 0.1;

        this.raycaster = new THREE.Raycaster();
        this.raycaster.params = {
            Line: { threshold: 0.2 },
            Points: { threshold: 0.2 },
        };

        this.lastMousePosition = new THREE.Vector2(0, 0);

        this.domElement.style.setProperty('touchAction', 'none');

        const rotateModel = (mousePosition: THREE.Vector2) => {
            const startAngle = new THREE.Vector2(
                (this.lastMousePosition.x / window.innerWidth) * 2 - 1,
                -(this.lastMousePosition.y / window.innerHeight) * 2 + 1,
            ).angle();

            const endAngle = new THREE.Vector2(
                (mousePosition.x / window.innerWidth) * 2 - 1,
                -(mousePosition.y / window.innerHeight) * 2 + 1,
            ).angle();

            const direction = startAngle >= endAngle ? -1 : 1;

            if (this.selectedObject == ellipseX) {
                model.rotateX(this.modelRotateStep * direction);
            } else if (this.selectedObject == ellipseY) {
                model.rotateY(this.modelRotateStep * direction);
            } else if (this.selectedObject == ellipseZ) {
                model.rotateZ(this.modelRotateStep * direction);
            }
        };

        const transformModel = (mousePosition: THREE.Vector2) => {
            this.lastMousePosition.x =
                (this.lastMousePosition.x / domElement.width) * 2 - 1;
            this.lastMousePosition.y =
                -(this.lastMousePosition.y / (domElement.height + 400)) * 2 + 1;

            const mouse = new THREE.Vector2(
                (mousePosition.x / domElement.width) * 2 - 1,
                -(mousePosition.y / (domElement.height + 400)) * 2 + 1,
            );

            const startVectorLenght =
                this.lastMousePosition.x * this.lastMousePosition.x +
                this.lastMousePosition.y * this.lastMousePosition.y;

            const endVectorLenght = mouse.x * mouse.x + mouse.y * mouse.y;

            if (endVectorLenght < 0.005) {
                this.domElement.removeEventListener('pointermove', onPointerMove);
            }

            const direction = startVectorLenght >= endVectorLenght ? -1 : 1;

            if (
                this.selectedObject == arrowX.line ||
                this.selectedObject == arrowX.cone
            ) {
                model.position.set(
                    model.position.x + this.modelMoveStep * direction,
                    model.position.y,
                    model.position.z,
                );
            } else if (
                this.selectedObject == arrowY.line ||
                this.selectedObject == arrowY.cone
            ) {
                model.position.set(
                    model.position.x,
                    model.position.y + this.modelMoveStep * direction,
                    model.position.z,
                );
            } else if (
                this.selectedObject == arrowZ.line ||
                this.selectedObject == arrowZ.cone
            ) {
                model.position.set(
                    model.position.x,
                    model.position.y,
                    model.position.z + this.modelMoveStep * direction,
                );
            }
        };

        const onMouseMove = (event: PointerEvent) => {
            const mousePosition = new THREE.Vector2(event.screenX, event.screenY);

            if (!this.selectedObject || model.children.includes(this.selectedObject)) {
                if (this.lastMousePosition.x - mousePosition.x > 0) {
                    this.angleX -= this.rotationAngle;
                } else if (this.lastMousePosition.x - mousePosition.x < 0) {
                    this.angleX += this.rotationAngle;
                }

                if (this.lastMousePosition.y - mousePosition.y > 0) {
                    this.angleY =
                        this.angleY > -Math.PI / 2 + 0.1
                            ? this.angleY - this.rotationAngle
                            : this.angleY;
                } else if (this.lastMousePosition.y - mousePosition.y < 0) {
                    this.angleY =
                        this.angleY < Math.PI / 2 - 0.1
                            ? this.angleY + this.rotationAngle
                            : this.angleY;
                }

                this.setCameraPosition();
            } else {
                if (this.selectedObject.type === 'Mesh') {
                    transformModel(mousePosition);
                } else if (this.selectedObject.type === 'Line') {
                    rotateModel(mousePosition);
                }
            }

            this.lastMousePosition = mousePosition;
        };

        const onMouseDown = (event: PointerEvent) => {
            this.lastMousePosition = new THREE.Vector2(event.screenX, event.screenY);

            const mouse = new THREE.Vector2();
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            this.raycaster.setFromCamera(mouse, camera);

            const intersects = this.raycaster.intersectObject(scene, true);

            if (intersects.length > 0) {
                this.selectedObject = intersects[0].object;
            } else {
                this.selectedObject = undefined;
            }
        };

        this.onMouseWheel = (event: WheelEvent) => {
            if (event.deltaY > 0) {
                camera.position.x *= ZOOM_STEP_INCREMENT;
                camera.position.y *= ZOOM_STEP_INCREMENT;
                camera.position.z *= ZOOM_STEP_INCREMENT;

                INITIAL_CAMERA_POSITION.z *= ZOOM_STEP_INCREMENT;
            } else {
                camera.position.x *= ZOOM_STEP_DECREMENT;
                camera.position.y *= ZOOM_STEP_DECREMENT;
                camera.position.z *= ZOOM_STEP_DECREMENT;

                INITIAL_CAMERA_POSITION.z *= ZOOM_STEP_DECREMENT;
            }
        };

        const onPointerMove = (event: PointerEvent) => {
            onMouseMove(event);
        };

        const onPointerUp = (event: PointerEvent) => {
            this.domElement.releasePointerCapture(event.pointerId);

            this.domElement.removeEventListener('pointermove', onPointerMove);

            this.domElement.removeEventListener('pointerup', onPointerUp);
        };

        this.onPointerDown = (event: PointerEvent) => {
            this.domElement.setPointerCapture(event.pointerId);

            this.domElement.addEventListener('pointermove', onPointerMove);

            this.domElement.addEventListener('pointerup', onPointerUp);

            onMouseDown(event);
        };

        this.domElement.addEventListener('pointerdown', this.onPointerDown);

        this.domElement.addEventListener('wheel', this.onMouseWheel);
    }

    setCameraPosition = () => {
        const afterRotateCameraPosistion = rotate(this.angleX, this.angleY);

        this.camera.position.x = afterRotateCameraPosistion.x;
        this.camera.position.y = afterRotateCameraPosistion.y;
        this.camera.position.z = afterRotateCameraPosistion.z;
    };

    setCustomAngles = (angleX: number, angleY: number) => {
        this.angleX = angleX;
        this.angleY = angleY;

        this.setCameraPosition();
    };

    drowTriad() {
        this.scene.add(ellipseX);
        this.scene.add(arrowY);
        this.scene.add(arrowX);
        this.scene.add(ellipseY);
        this.scene.add(arrowZ);
        this.scene.add(ellipseZ);
    }

    clearTriad() {
        this.scene.remove(ellipseX);
        this.scene.remove(arrowY);
        this.scene.remove(arrowX);
        this.scene.remove(ellipseY);
        this.scene.remove(arrowZ);
        this.scene.remove(ellipseZ);
    }

    dispose = () => {
        this.domElement.removeEventListener('pointerdown', this.onPointerDown);

        this.domElement.removeEventListener('wheel', this.onMouseWheel);
    };
}
