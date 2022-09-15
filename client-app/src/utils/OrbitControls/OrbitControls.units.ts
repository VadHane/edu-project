import {
    ArrowHelper,
    BufferGeometry,
    EllipseCurve,
    Line,
    LineBasicMaterial,
    Vector3,
} from 'three';

export const arrowX = new ArrowHelper(
    new Vector3(1, 0, 0).normalize(),
    new Vector3(0, 0, 0),
    10,
    0x00ff00,
    undefined,
    1,
);

export const arrowY = new ArrowHelper(
    new Vector3(0, 1, 0).normalize(),
    new Vector3(0, 0, 0),
    10,
    0xff0000,
    undefined,
    1,
);

export const arrowZ = new ArrowHelper(
    new Vector3(0, 0, 1).normalize(),
    new Vector3(0, 0, 0),
    10,
    0x0000ff,
    undefined,
    1,
);

const geometryEllipseX = new BufferGeometry().setFromPoints(
    new EllipseCurve(0, 0, 10, 10, 0, 2 * Math.PI, false, 0).getPoints(150),
);

const geometryEllipseZ = new BufferGeometry().setFromPoints(
    new EllipseCurve(0, 0, 10, 10, 0, 2 * Math.PI, false, 0).getPoints(150),
);

const geometryEllipseY = new BufferGeometry().setFromPoints(
    new EllipseCurve(0, 0, 10, 10, 0, 2 * Math.PI, false, 0).getPoints(150),
);

export const ellipseX = new Line(
    geometryEllipseX,
    new LineBasicMaterial({ color: 0x00ff00 }),
);

export const ellipseY = new Line(
    geometryEllipseY,
    new LineBasicMaterial({ color: 0xff0000 }),
);

export const ellipseZ = new Line(
    geometryEllipseZ,
    new LineBasicMaterial({ color: 0x0000ff }),
);

ellipseX.rotateY(Math.PI / 2);
ellipseY.rotateX(Math.PI / 2);
