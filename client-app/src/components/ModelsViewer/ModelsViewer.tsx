import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from '../../utils/OrbitControls/OrbitControls';
import CircularProgress from '@mui/material/CircularProgress';
import { viewerContainerStyles, progressStyles, modalStyle } from './ModelsViewer.styles';
import { ModelsViewerProps } from './ModelsViewer.types';
import {
    Box,
    Button,
    ButtonGroup,
    Modal,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { loadOBJModel } from '../../utils/OBJLoader';
import {
    CAMERA_BUTTON_CAPTION,
    CANCEL,
    COEFS_ARE_ZERO_ERROR,
    COEF_NOT_NUMBER_ERROR,
    EDIT_MODE_BUTTON_CAPTION,
    OK,
    SLICE_BUTTON_CAPTION,
} from './ModelsViewer.constants';

const ModelsViewer: FunctionComponent<ModelsViewerProps> = ({ fileUrl }) => {
    const refContainer = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [renderer, setRenderer] = useState<THREE.WebGLRenderer>();
    const [scene, setScene] = useState<THREE.Scene>();
    const [showTriad, setShowTriad] = useState<boolean>(false);
    const [isSliced, setIsSliced] = useState<boolean>(false);

    const [plane, setPlane] = useState<THREE.Plane>();
    const [planeModalIsOpen, setPlaneModelIsOpen] = useState<boolean>(false);
    const [coefA, setCoefA] = useState<string>('1');
    const [coefB, setCoefB] = useState<string>('0');
    const [coefC, setCoefC] = useState<string>('0');
    const [coefD, setCoefD] = useState<string>('0');

    const [controls, setControls] = useState<OrbitControls>();

    const [model, setModel] = useState<THREE.Group>();

    useEffect(() => {
        const { current: container } = refContainer;
        if (container && !renderer) {
            const scW = container?.clientWidth;
            const scH = container.clientHeight;

            const renderer = new THREE.WebGLRenderer({
                antialias: true,
                alpha: true,
            });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(scW, scH);
            renderer.setClearColor(0xffffff);
            renderer.outputEncoding = THREE.sRGBEncoding;

            container.appendChild(renderer.domElement);
            setRenderer(renderer);

            const scene = new THREE.Scene();
            setScene(scene);

            const camera = new THREE.PerspectiveCamera(
                75,
                window.innerWidth / window.innerHeight,
                0.1,
                1000,
            );
            const ambientLight = new THREE.AmbientLight(0xcccccc, 1);
            scene.add(ambientLight);

            const cube = new THREE.Mesh(
                new THREE.BoxGeometry(1, 1, 1),
                new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
            );
            scene.add(cube);

            loadOBJModel(scene, fileUrl, {
                receiveShadow: false,
                castShadow: false,
            }).then((obj) => {
                setModel(obj);
                scene.add(obj);

                const controls = new OrbitControls(
                    camera,
                    renderer.domElement,
                    scene,
                    obj,
                );
                setControls(controls);

                animate();
                setLoading(false);
            });

            let req = 0;
            const animate = () => {
                req = requestAnimationFrame(animate);

                renderer.render(scene, camera);
            };

            return () => {
                cancelAnimationFrame(req);
                renderer.dispose();
                controls?.dispose();
            };
        }
    }, []);

    useEffect(() => {
        if (!controls) {
            return;
        }

        if (showTriad) {
            controls?.drowTriad();
        } else {
            controls?.clearTriad();
        }
    }, [scene, showTriad]);

    useEffect(() => {
        if (!scene || !model) {
            return;
        }

        if (plane) {
            const copyModel = model.clone(true);
            scene.remove(model);

            const group = new THREE.Group();

            copyModel?.children.forEach((child) => {
                if ((child as THREE.Mesh).isMesh) {
                    const geometry = mergeVertices((child as THREE.Mesh).geometry);

                    const vertices = geometry.getAttribute('position').array;

                    const needToUpdate = () => {
                        for (let i = 0; i < vertices.length; i += 3) {
                            if (
                                plane.distanceToPoint(
                                    new THREE.Vector3(
                                        vertices[i],
                                        vertices[i + 1],
                                        vertices[i + 2],
                                    ),
                                ) < 0
                            ) {
                                return true;
                            }
                        }

                        return false;
                    };

                    if (needToUpdate()) {
                        const normals = geometry.getAttribute('normal').array;
                        const indices = geometry.getIndex()?.array || [];

                        const updVertices: number[] = [];
                        const updNormals: number[] = [];
                        const updIndices: number[] = [];

                        const addVertices = (
                            v: THREE.Vector3,
                            normals: THREE.Vector3,
                        ) => {
                            updVertices.push(v.x, v.y, v.z);
                            updNormals.push(normals.x, normals.y, normals.z);

                            return (updVertices.length - 3) / 3;
                        };

                        for (let i = 0; i < indices.length; i += 3) {
                            const points = [
                                new THREE.Vector3(
                                    vertices[indices[i] * 3],
                                    vertices[indices[i] * 3 + 1],
                                    vertices[indices[i] * 3 + 2],
                                ),
                                new THREE.Vector3(
                                    vertices[indices[i + 1] * 3],
                                    vertices[indices[i + 1] * 3 + 1],
                                    vertices[indices[i + 1] * 3 + 2],
                                ),
                                new THREE.Vector3(
                                    vertices[indices[i + 2] * 3],
                                    vertices[indices[i + 2] * 3 + 1],
                                    vertices[indices[i + 2] * 3 + 2],
                                ),
                            ];

                            const distances = points
                                .map((point) => {
                                    return plane.distanceToPoint(point);
                                })
                                .filter((n) => n > 0);

                            const way = distances.filter((n) => n >= 0).length;

                            if (way === 3) {
                                updIndices.push(
                                    addVertices(
                                        points[0],
                                        new THREE.Vector3(
                                            normals[indices[i] * 3],
                                            normals[indices[i] * 3 + 1],
                                            normals[indices[i] * 3 + 2],
                                        ),
                                    ),
                                    addVertices(
                                        points[1],
                                        new THREE.Vector3(
                                            normals[indices[i + 1] * 3],
                                            normals[indices[i + 1] * 3 + 1],
                                            normals[indices[i + 1] * 3 + 2],
                                        ),
                                    ),
                                    addVertices(
                                        points[2],
                                        new THREE.Vector3(
                                            normals[indices[i + 2] * 3],
                                            normals[indices[i + 2] * 3 + 1],
                                            normals[indices[i + 2] * 3 + 2],
                                        ),
                                    ),
                                );
                            } else if (way === 2) {
                                const deleteElem = points.filter(
                                    (p) => plane.distanceToPoint(p) < 0,
                                )[0];
                                const [first, second] = points.filter(
                                    (p) => !p.equals(deleteElem),
                                );
                                const firstPoint = new THREE.Vector3();
                                const secondPoint = new THREE.Vector3();
                                plane.intersectLine(
                                    new THREE.Line3(first, deleteElem),
                                    firstPoint,
                                );
                                plane.intersectLine(
                                    new THREE.Line3(second, deleteElem),
                                    secondPoint,
                                );

                                const v1 = new THREE.Vector3(
                                    second.x - secondPoint.x,
                                    second.y - secondPoint.y,
                                    second.z - secondPoint.z,
                                ).normalize();
                                const v2 = new THREE.Vector3(
                                    second.x - first.x,
                                    second.y - first.y,
                                    second.z - first.z,
                                ).normalize();
                                const _normal = v1.cross(v2);

                                const indexOfFirstOld = addVertices(first, _normal);
                                const indexOfSecondOld = addVertices(second, _normal);
                                const indexOfFirstNew = addVertices(firstPoint, _normal);
                                const indexOfSecondNew = addVertices(
                                    secondPoint,
                                    _normal,
                                );

                                const dotProduct = _normal.dot(
                                    new THREE.Vector3(0, 0, -1).sub(first),
                                );

                                if (dotProduct >= 0) {
                                    updIndices.push(
                                        indexOfFirstOld,
                                        indexOfFirstNew,
                                        indexOfSecondOld,
                                    );
                                    updIndices.push(
                                        indexOfFirstNew,
                                        indexOfSecondNew,
                                        indexOfSecondOld,
                                    );
                                } else {
                                    updIndices.push(
                                        indexOfFirstOld,
                                        indexOfSecondOld,
                                        indexOfFirstNew,
                                    );
                                    updIndices.push(
                                        indexOfFirstNew,
                                        indexOfSecondOld,
                                        indexOfSecondNew,
                                    );
                                }
                            } else if (way === 1) {
                                const first = points.filter(
                                    (p) => plane.distanceToPoint(p) >= 0,
                                )[0];
                                const [firstDel, secondDel] = points.filter(
                                    (p) => !p.equals(first),
                                );
                                const firstPoint = new THREE.Vector3();
                                const secondPoint = new THREE.Vector3();
                                plane.intersectLine(
                                    new THREE.Line3(firstDel, first),
                                    firstPoint,
                                );
                                plane.intersectLine(
                                    new THREE.Line3(secondDel, first),
                                    secondPoint,
                                );

                                const v1 = new THREE.Vector3(
                                    first.x - secondPoint.x,
                                    first.y - secondPoint.y,
                                    first.z - secondPoint.z,
                                ).normalize();
                                const v2 = new THREE.Vector3(
                                    first.x - firstPoint.x,
                                    first.y - firstPoint.y,
                                    first.z - firstPoint.z,
                                ).normalize();
                                const _normal = v1.cross(v2);

                                const indexOfFirstOld = addVertices(first, _normal);
                                const indexOfFirstNew = addVertices(firstPoint, _normal);
                                const indexOfSecondNew = addVertices(
                                    secondPoint,
                                    _normal,
                                );

                                const dotProduct = _normal.dot(
                                    new THREE.Vector3(0, 0, -1).sub(first),
                                );
                                if (dotProduct >= 0) {
                                    updIndices.push(
                                        indexOfFirstNew,
                                        indexOfSecondNew,
                                        indexOfFirstOld,
                                    );
                                } else {
                                    updIndices.push(
                                        indexOfFirstNew,
                                        indexOfFirstOld,
                                        indexOfSecondNew,
                                    );
                                }
                            }
                        }

                        geometry.setAttribute(
                            'position',
                            new THREE.BufferAttribute(new Float32Array(updVertices), 3),
                        );
                        geometry.setAttribute(
                            'normal',
                            new THREE.Float32BufferAttribute(normals, 3),
                        );
                        geometry.setAttribute(
                            'uv',
                            new THREE.Float32BufferAttribute([], 2),
                        );
                        geometry.setIndex(updIndices);
                    }

                    group.add(
                        new THREE.Mesh(
                            geometry,
                            new THREE.MeshBasicMaterial({ color: 'black' }),
                        ),
                    );
                }
            });

            scene.add(group);
        } else {
            scene.children.forEach((child) => {
                if ((child as THREE.Group).isGroup) {
                    scene.remove(child);
                }
            });

            scene.add(model);
        }
    }, [plane]);

    const onClickFrontHandler = () => {
        const axis = new THREE.Vector3(0, 0, 0);
        const angle = 0;

        controls?.setCameraPosition(axis, angle);
    };

    const onClickBackHandler = () => {
        const axis = new THREE.Vector3(0, 1, 0);
        const angle = Math.PI;

        controls?.setCameraPosition(axis, angle);
    };

    const onClickLeftHandler = () => {
        const axis = new THREE.Vector3(0, 1, 0);
        const angle = -Math.PI / 2;

        controls?.setCameraPosition(axis, angle);
    };

    const onClickRightHandler = () => {
        const axis = new THREE.Vector3(0, 1, 0);
        const angle = Math.PI / 2;

        controls?.setCameraPosition(axis, angle);
    };

    const onClickTopHandler = () => {
        const axis = new THREE.Vector3(1, 0, 0);
        const angle = -Math.PI / 2;

        controls?.setCameraPosition(axis, angle);
    };

    const onClickBottomHandler = () => {
        const axis = new THREE.Vector3(1, 0, 0);
        const angle = Math.PI / 2;

        controls?.setCameraPosition(axis, angle);
    };

    const onClickSliceButtomHandler = () => {
        if (isSliced) {
            setIsSliced(false);
            setPlane(undefined);
        } else {
            setPlaneModelIsOpen(true);
        }
    };

    const onCloseModal = () => {
        setPlaneModelIsOpen(false);
        setPlane(undefined);
    };

    const onSendModal = () => {
        const A = +coefA;
        const B = +coefB;
        const C = +coefC;
        const D = +coefD;

        if (isNaN(A) || isNaN(B) || isNaN(C) || isNaN(D)) {
            return;
        }

        if (A !== 0 || B !== 0 || C !== 0) {
            const localPlane = new THREE.Plane(new THREE.Vector3(A, B, C), D);
            setPlane(localPlane);
            setPlaneModelIsOpen(false);
            setIsSliced(true);
        }
    };

    const getHelperTextForTextField = (coef: string) => {
        if (+coefA === 0 && +coefB === 0 && +coefC === 0) {
            return COEFS_ARE_ZERO_ERROR;
        }

        if (isNaN(+coef)) {
            return COEF_NOT_NUMBER_ERROR;
        }
    };

    const isTextFieldError = (coef: string) => {
        if (+coefA === 0 && +coefB === 0 && +coefC === 0) {
            return true;
        }

        if (isNaN(+coef)) {
            return true;
        }

        return false;
    };

    return (
        <>
            <div style={viewerContainerStyles} ref={refContainer}>
                {loading && (
                    <span style={progressStyles}>
                        <CircularProgress />
                    </span>
                )}
            </div>

            <ButtonGroup
                variant="outlined"
                aria-label="outlined button group"
                sx={{ margin: '5px' }}
            >
                <Button disabled color="error">
                    {CAMERA_BUTTON_CAPTION}
                </Button>
                <Button onClick={onClickFrontHandler}>Front</Button>
                <Button onClick={onClickBackHandler}>Back</Button>
                <Button onClick={onClickLeftHandler}>Left</Button>
                <Button onClick={onClickRightHandler}>Right</Button>
                <Button onClick={onClickTopHandler}>Top</Button>
                <Button onClick={onClickBottomHandler}>Bottom</Button>
            </ButtonGroup>
            <ButtonGroup variant="outlined" aria-label="outlined button group">
                <Button onClick={() => setShowTriad((c) => !c)} disabled={isSliced}>
                    {EDIT_MODE_BUTTON_CAPTION} {showTriad ? 'On' : 'Off'}
                </Button>
            </ButtonGroup>
            <ButtonGroup variant="outlined" aria-label="outlined button group">
                <Button onClick={onClickSliceButtomHandler} disabled={showTriad}>
                    {SLICE_BUTTON_CAPTION} {isSliced ? 'On' : 'Off'}
                </Button>
            </ButtonGroup>

            <Modal open={planeModalIsOpen} onClose={onCloseModal}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" component="h2" align="center">
                        Enter plane coefficients
                    </Typography>

                    <TextField
                        id="filled-basic"
                        label="A"
                        variant="filled"
                        margin="dense"
                        size="small"
                        value={coefA}
                        onChange={(e) => setCoefA(e.currentTarget.value)}
                        error={isTextFieldError(coefA)}
                        helperText={getHelperTextForTextField(coefA)}
                    />
                    <TextField
                        id="filled-basic"
                        label="B"
                        variant="filled"
                        margin="dense"
                        size="small"
                        value={coefB}
                        onChange={(e) => setCoefB(e.currentTarget.value)}
                        error={isTextFieldError(coefB)}
                        helperText={getHelperTextForTextField(coefB)}
                    />
                    <TextField
                        id="filled-basic"
                        label="C"
                        variant="filled"
                        margin="dense"
                        size="small"
                        value={coefC}
                        onChange={(e) => setCoefC(e.currentTarget.value)}
                        error={isTextFieldError(coefC)}
                        helperText={getHelperTextForTextField(coefC)}
                    />
                    <TextField
                        id="filled-basic"
                        label="D"
                        variant="filled"
                        margin="dense"
                        size="small"
                        value={coefD}
                        onChange={(e) => setCoefD(e.currentTarget.value)}
                        error={isNaN(+coefD)}
                        helperText={isNaN(+coefD) && COEF_NOT_NUMBER_ERROR}
                    />

                    <Stack
                        display="flex"
                        direction="row"
                        justifyContent="flex-end"
                        spacing={1}
                        sx={{ width: '90%', m: 1, marginTop: '50px' }}
                    >
                        <Button variant="contained" size="small" onClick={onCloseModal}>
                            {CANCEL}
                        </Button>
                        <Button
                            variant="contained"
                            size="small"
                            color="success"
                            onClick={onSendModal}
                        >
                            {OK}
                        </Button>
                    </Stack>
                </Box>
            </Modal>
        </>
    );
};

export default ModelsViewer;
