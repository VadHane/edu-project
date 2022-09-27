import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

export type loaderOptions = {
    receiveShadow: boolean;
    castShadow: boolean;
};

export const loadOBJModel = (
    scene: THREE.Scene,
    objectUrl: string,
    options: loaderOptions,
) => {
    const { receiveShadow, castShadow } = options;
    return new Promise<THREE.Group>((resolve, reject) => {
        const loader = new OBJLoader();

        loader.load(
            objectUrl,
            (_obj) => {
                _obj.name = 'Model';
                _obj.position.set(0, 0, 0);
                _obj.receiveShadow = receiveShadow;
                _obj.castShadow = castShadow;

                const loader = new THREE.TextureLoader();
                loader.load('../../texture.jpg', (texture) => {
                    _obj.traverse(function (child) {
                        child.castShadow = castShadow;
                        child.receiveShadow = receiveShadow;

                        const mesh = child as THREE.Mesh;

                        if (mesh.isMesh) {
                            mesh.material = new THREE.MeshBasicMaterial({ map: texture });
                        }
                    });
                });

                resolve(_obj);
            },
            undefined,
            function (error) {
                reject(error);
            },
        );
    });
};
