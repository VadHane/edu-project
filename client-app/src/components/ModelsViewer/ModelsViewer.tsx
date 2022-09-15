import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from '../../utils/OrbitControls/OrbitControls';
import CircularProgress from '@mui/material/CircularProgress';
import { viewerContainerStyles, progressStyles } from './ModelsViewer.styles';
import { ModelsViewerProps } from './ModelsViewer.types';
import { Button, ButtonGroup } from '@mui/material';
import { loadOBJModel } from '../../utils/OBJLoader';
import {
    BACK_POSITION,
    BOTTOM_POSITION,
    DEFAULT_POSITION,
    FRONT_POSITION,
    LEFT_POSITION,
    RIGHT_POSITION,
    TOP_POSITION,
} from './ModelsViewer.constants';
import { Mesh } from 'three';

const ModelsViewer: FunctionComponent<ModelsViewerProps> = ({ fileUrl }) => {
    const refContainer = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [renderer, setRenderer] = useState<THREE.WebGLRenderer>();
    const [scene, setScene] = useState<THREE.Scene>();
    const [showTriad, setShowTriad] = useState<boolean>(false);

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

            const camera = new THREE.PerspectiveCamera(75, scW / scH, 0.1, 1000);
            const target = new THREE.Vector3(0, 0, 0);
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

                controls.setCameraPosition();
                animate();
                setLoading(false);
            });

            let req = 0;
            const animate = () => {
                req = requestAnimationFrame(animate);

                camera.lookAt(target);

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

        const localPlane = new THREE.Plane(new THREE.Vector3(1, 1, 0), 0);
        const planeNormalX = localPlane.normal.x;
        const planeNormalY = localPlane.normal.y;
        const planeNormalZ = localPlane.normal.z;
        const constant = localPlane.constant;

        console.log(model);
        console.log(model?.children[0].type);
        console.log(model?.children[0].geometry);
    });

    const onClickFrontHandler = () => {
        controls?.setCustomAngles(FRONT_POSITION.x, FRONT_POSITION.y);
    };

    const onClickBackHandler = () => {
        controls?.setCustomAngles(BACK_POSITION.x, BACK_POSITION.y);
    };

    const onClickLeftHandler = () => {
        controls?.setCustomAngles(LEFT_POSITION.x, LEFT_POSITION.y);
    };

    const onClickRightHandler = () => {
        controls?.setCustomAngles(RIGHT_POSITION.x, RIGHT_POSITION.y);
    };

    const onClickTopHandler = () => {
        controls?.setCustomAngles(TOP_POSITION.x, TOP_POSITION.y);
    };

    const onClickBottomHandler = () => {
        controls?.setCustomAngles(BOTTOM_POSITION.x, BOTTOM_POSITION.y);
    };

    const onClickDefaultHandler = () => {
        controls?.setCustomAngles(DEFAULT_POSITION.x, DEFAULT_POSITION.y);
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
                    Camera:{' '}
                </Button>
                <Button onClick={onClickFrontHandler}>Front</Button>
                <Button onClick={onClickBackHandler}>Back</Button>
                <Button onClick={onClickLeftHandler}>Left</Button>
                <Button onClick={onClickRightHandler}>Right</Button>
                <Button onClick={onClickTopHandler}>Top</Button>
                <Button onClick={onClickBottomHandler}>Bottom</Button>
                <Button onClick={onClickDefaultHandler}>Default</Button>
            </ButtonGroup>
            <ButtonGroup variant="outlined" aria-label="outlined button group">
                <Button onClick={() => setShowTriad((c) => !c)}>
                    Edit mode: {showTriad ? 'On' : 'Off'}
                </Button>
            </ButtonGroup>
        </>
    );
};

export default ModelsViewer;
