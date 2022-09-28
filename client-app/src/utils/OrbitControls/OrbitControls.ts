import * as THREE from 'three';
import {
    ArrowHelper,
    Vector3,
    BufferGeometry,
    EllipseCurve,
    Line,
    LineBasicMaterial,
} from 'three';
import {
    DEFAULT_ANGLE_X,
    DEFAULT_ANGLE_Y,
    INITIAL_CAMERA_POSITION,
    ROTATION_ANGLE,
    ZOOM_STEP_DECREMENT,
    ZOOM_STEP_INCREMENT,
} from './OrbitControls.constants';

const getDefaultCameraDistance = (model: THREE.Group) => {
    const maxX = new THREE.Vector3();
    const maxY = new THREE.Vector3();
    const maxZ = new THREE.Vector3();

    model.children.forEach((child) => {
        const points = (child as THREE.Mesh).geometry.getAttribute('position').array;
        const len = points.length;

        for (let index = 0; index < len; index += 3) {
            if (points[index] > maxX.x) {
                maxX.x = points[index];
                maxX.y = points[index + 1];
                maxX.z = points[index + 2];
            }

            if (points[index + 1] > maxY.y) {
                maxY.x = points[index];
                maxY.y = points[index + 1];
                maxY.z = points[index + 2];
            }

            if (points[index + 2] > maxZ.z) {
                maxZ.x = points[index];
                maxZ.y = points[index + 1];
                maxZ.z = points[index + 2];
            }
        }
    });

    const distanceX = maxX.distanceTo(new THREE.Vector3());
    const distanceY = maxY.distanceTo(new THREE.Vector3());
    const distanceZ = maxZ.distanceTo(new THREE.Vector3());

    return Math.max(distanceX, distanceY, distanceZ);
};

export class OrbitControls extends THREE.EventDispatcher {
    camera: THREE.OrthographicCamera | THREE.PerspectiveCamera;
    domElement: HTMLCanvasElement;
    scene: THREE.Scene;
    model: THREE.Group;

    target: THREE.Vector3;
    up: THREE.Vector3;
    right: THREE.Vector3;

    angleX: number;
    angleY: number;
    rotationAngle: number;

    arrowX: THREE.ArrowHelper;
    arrowY: THREE.ArrowHelper;
    arrowZ: THREE.ArrowHelper;
    ellipseX: THREE.Line;
    ellipseY: THREE.Line;
    ellipseZ: THREE.Line;

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

        this.target = new THREE.Vector3(0, 0, 0);
        this.up = new THREE.Vector3(0, 1, 0);
        this.right = new THREE.Vector3(1, 0, 0);

        const distance = getDefaultCameraDistance(this.model) * 1.2;

        this.arrowX = new ArrowHelper(
            new Vector3(1, 0, 0).normalize(),
            new Vector3(0, 0, 0),
            distance,
            0x00ff00,
            undefined,
            2,
        );

        this.arrowY = new ArrowHelper(
            new Vector3(0, 1, 0).normalize(),
            new Vector3(0, 0, 0),
            distance,
            0xff0000,
            undefined,
            2,
        );

        this.arrowZ = new ArrowHelper(
            new Vector3(0, 0, 1).normalize(),
            new Vector3(0, 0, 0),
            distance,
            0x0000ff,
            undefined,
            2,
        );

        const geometryEllipseX = new BufferGeometry().setFromPoints(
            new EllipseCurve(
                0,
                0,
                distance,
                distance,
                0,
                2 * Math.PI,
                false,
                0,
            ).getPoints(150),
        );

        const geometryEllipseZ = new BufferGeometry().setFromPoints(
            new EllipseCurve(
                0,
                0,
                distance,
                distance,
                0,
                2 * Math.PI,
                false,
                0,
            ).getPoints(150),
        );

        const geometryEllipseY = new BufferGeometry().setFromPoints(
            new EllipseCurve(
                0,
                0,
                distance,
                distance,
                0,
                2 * Math.PI,
                false,
                0,
            ).getPoints(150),
        );

        this.ellipseX = new Line(
            geometryEllipseX,
            new LineBasicMaterial({ color: 0x00ff00 }),
        );

        this.ellipseY = new Line(
            geometryEllipseY,
            new LineBasicMaterial({ color: 0xff0000 }),
        );

        this.ellipseZ = new Line(
            geometryEllipseZ,
            new LineBasicMaterial({ color: 0x0000ff }),
        );

        this.ellipseX.rotateY(Math.PI / 2);
        this.ellipseY.rotateX(Math.PI / 2);

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

        INITIAL_CAMERA_POSITION.z = distance * 2;
        camera.position.copy(INITIAL_CAMERA_POSITION);

        const penTransform = (mouse: THREE.Vector2) => {
            const mousePos = targetPlaneToSphere(
                new THREE.Vector2(
                    (mouse.x / window.innerWidth) * 2 - 1,
                    -(mouse.y / window.innerHeight) * 2 + 1,
                ),
            );
            const lastPos = targetPlaneToSphere(
                new THREE.Vector2(
                    (this.lastMousePosition.x / window.innerWidth) * 2 - 1,
                    -(this.lastMousePosition.y / window.innerHeight) * 2 + 1,
                ),
            );

            const deltaX = (lastPos.x - mousePos.x) * 5;
            const deltaY = (lastPos.y - mousePos.y) * 5;

            const updRight = this.right.clone().multiplyScalar(deltaX);
            const updUp = this.up.clone().multiplyScalar(deltaY);
            const deltaTranslate = updRight.add(updUp);
            const updCameraPosition = camera.position.clone().add(deltaTranslate);

            this.target = this.target.add(deltaTranslate);

            camera.position.copy(updCameraPosition);
            camera.lookAt(this.target.clone());

            this.lastMousePosition.copy(mouse);
        };

        const targetPlaneToSphere = (point: THREE.Vector2) => {
            const vec = new THREE.Vector3();

            if (point.length() >= 1.0) {
                point.normalize();

                vec.set(point.x, point.y, 0.0);
            } else {
                const z = Math.sqrt(1.0 - Math.pow(point.x, 2) - Math.pow(point.y, 2));

                vec.set(point.x, point.y, z * -1);
            }

            return vec;
        };

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
            if (this.selectedObject == this.ellipseX) {
                model.rotateX(this.modelRotateStep * direction);
            } else if (this.selectedObject == this.ellipseY) {
                model.rotateY(this.modelRotateStep * direction);
            } else if (this.selectedObject == this.ellipseZ) {
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

            const center = model.position.clone().project(camera);

            const startDistance = this.lastMousePosition.distanceTo(
                new THREE.Vector2(center.x, center.y),
            );
            const endDistance = mouse.distanceTo(new THREE.Vector2(center.x, center.y));

            if (startDistance < this.lastMousePosition.distanceTo(mouse)) {
                this.domElement.removeEventListener('pointermove', onPointerMove);
            }

            const direction = startDistance >= endDistance ? -1 : 1;

            if (
                this.selectedObject == this.arrowX.line ||
                this.selectedObject == this.arrowX.cone
            ) {
                model.translateX(this.modelMoveStep * direction);
            } else if (
                this.selectedObject == this.arrowY.line ||
                this.selectedObject == this.arrowY.cone
            ) {
                model.translateY(this.modelMoveStep * direction);
            } else if (
                this.selectedObject == this.arrowZ.line ||
                this.selectedObject == this.arrowZ.cone
            ) {
                model.translateZ(this.modelMoveStep * direction);
            }
        };

        const rotateCamera = (mousePosition: THREE.Vector2) => {
            const ar = window.innerWidth / window.innerHeight;

            const mouse = targetPlaneToSphere(
                new THREE.Vector2(
                    ((ar * mousePosition.x) / window.innerWidth) * 2 - ar,
                    -(mousePosition.y / window.innerHeight) * 2 + 1,
                ),
            );
            const lastPos = targetPlaneToSphere(
                new THREE.Vector2(
                    ((ar * this.lastMousePosition.x) / window.innerWidth) * 2 - ar,
                    -(this.lastMousePosition.y / window.innerHeight) * 2 + 1,
                ),
            );

            const angle = -lastPos.angleTo(mouse);
            const axis = mouse.cross(lastPos);

            if (camera.position.z < 0) {
                axis.x = -axis.x;
            }

            const toWordlCameraSpace = camera.modelViewMatrix.transpose();
            const updAxis = axis.applyMatrix4(toWordlCameraSpace).normalize();

            // const t = 1 - Math.cos(angle);
            // const c = Math.cos(angle);
            // const s = Math.sin(angle);
            // const x = updAxis.x;
            // const y = updAxis.y;
            // const z = updAxis.z;

            // const o = new THREE.Matrix3();
            // o.set(
            //     t * x * x + c,
            //     t * x * y - z * s,
            //     t * x * z + y * s,
            //     t * x * y + z * s,
            //     t * y * y + c,
            //     t * y * z - x * s,
            //     t * x * z - y * s,
            //     t * y * z + x * s,
            //     t * z * z + c,
            // );

            const revPosCamera = camera.position.clone().sub(this.target);
            const updCamera = revPosCamera
                .applyAxisAngle(updAxis, angle)
                .add(this.target);

            this.up = this.up.applyAxisAngle(axis, angle);
            this.right = this.right.applyAxisAngle(axis, angle);

            camera.position.copy(updCamera);
            camera.lookAt(this.target);
        };

        const onMouseMove = (mousePosition: THREE.Vector2) => {
            if (this.selectedObject?.type === 'Mesh') {
                if (this.selectedObject.parent?.type !== 'ArrowHelper') {
                    rotateCamera(mousePosition);
                } else {
                    transformModel(mousePosition);
                }
            } else if (this.selectedObject?.type === 'Line') {
                rotateModel(mousePosition);
            } else {
                rotateCamera(mousePosition);
            }

            this.lastMousePosition.copy(mousePosition);
        };

        const onMouseDown = (event: PointerEvent) => {
            this.lastMousePosition = new THREE.Vector2(event.screenX, event.screenY);

            if (event.button !== 0) {
                return;
            }

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
            const mousePosition = new THREE.Vector2(event.screenX, event.screenY);

            if (event.buttons === 1) {
                onMouseMove(mousePosition);
            } else if (event.buttons === 4) {
                penTransform(mousePosition);
            }
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

    setCameraPosition = (axis: THREE.Vector3, angle: number) => {
        this.camera.position.copy(INITIAL_CAMERA_POSITION);
        this.target = new THREE.Vector3(0, 0, 0);
        this.up = new THREE.Vector3(0, 1, 0);
        this.right = new THREE.Vector3(1, 0, 0);

        this.camera.position.applyAxisAngle(axis, angle);
        this.up.applyAxisAngle(axis, angle);
        this.right.applyAxisAngle(axis, angle);

        this.camera.lookAt(this.target);
    };

    drowTriad() {
        this.model.add(this.ellipseX);
        this.model.add(this.arrowY);
        this.model.add(this.arrowX);
        this.model.add(this.ellipseY);
        this.model.add(this.arrowZ);
        this.model.add(this.ellipseZ);
    }

    clearTriad() {
        this.model.remove(this.ellipseX);
        this.model.remove(this.arrowY);
        this.model.remove(this.arrowX);
        this.model.remove(this.ellipseY);
        this.model.remove(this.arrowZ);
        this.model.remove(this.ellipseZ);
    }

    dispose = () => {
        this.domElement.removeEventListener('pointerdown', this.onPointerDown);

        this.domElement.removeEventListener('wheel', this.onMouseWheel);
    };
}
