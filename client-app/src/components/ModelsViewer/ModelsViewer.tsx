import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import CircularProgress from '@mui/material/CircularProgress';
import { viewerContainerStyles, progressStyles } from './ModelsViewer.styles';
import { loaderOptions, ModelsViewerProps } from './ModelsViewer.types';

function loadOBJModel(scene: THREE.Scene, objectUrl: string, options: loaderOptions) {
    const { receiveShadow, castShadow } = options;
    return new Promise((resolve, reject) => {
        const loader = new OBJLoader();
        loader.load(
            '/building_04.obj',
            (obj) => {
                obj.name = 'Model';
                obj.position.y = 0;
                obj.position.x = 0;
                obj.receiveShadow = receiveShadow;
                obj.castShadow = castShadow;
                scene.add(obj);

                resolve(obj);
            },
            undefined,
            function (error) {
                reject(error);
            },
        );
    });
}

const ModelsViewer: FunctionComponent<ModelsViewerProps> = ({ fileUrl }) => {
    const refContainer = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [renderer, setRenderer] = useState<THREE.WebGLRenderer>();

    useEffect(() => {
        const { current: container } = refContainer;
        if (container && !renderer) {
            const size = Math.min(container.clientHeight, container?.clientWidth);

            const scW = size;
            const scH = size;

            const renderer = new THREE.WebGLRenderer({
                antialias: true,
                alpha: true,
            });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(scW, scH);
            renderer.outputEncoding = THREE.sRGBEncoding;

            container.appendChild(renderer.domElement);
            setRenderer(renderer);

            const scene = new THREE.Scene();
            const scale = 5.6;
            const camera = new THREE.OrthographicCamera(
                -scale,
                scale,
                scale,
                -scale,
                0.01,
                50000,
            );
            const target = new THREE.Vector3(-0.5, 1.2, 0);
            const initialCameraPosition = new THREE.Vector3(
                20 * Math.sin(0.2 * Math.PI),
                10,
                20 * Math.cos(0.2 * Math.PI),
            );
            const ambientLight = new THREE.AmbientLight(0xcccccc, 1);
            scene.add(ambientLight);
            const controls = new OrbitControls(camera, renderer.domElement);
            controls.autoRotate = true;
            controls.target = target;

            loadOBJModel(scene, fileUrl, {
                receiveShadow: false,
                castShadow: false,
            }).then(() => {
                camera.position.y = initialCameraPosition.y;
                camera.position.x = initialCameraPosition.x;
                camera.position.z = initialCameraPosition.z;
                camera.lookAt(target);
                renderer.render(scene, camera);
                setLoading(false);
            });

            return () => {
                renderer.dispose();
            };
        }
    }, []);

    return (
        <div style={viewerContainerStyles} ref={refContainer}>
            {loading && (
                <span style={progressStyles}>
                    <CircularProgress />
                </span>
            )}
        </div>
    );
};

export default ModelsViewer;
