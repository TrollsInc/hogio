import React from "react";
import { useLoader } from "react-three-fiber";
import * as THREE from "three";
import { Water } from "three/examples/jsm/objects/Water";
const ToonWater = () => {
    const waterNormal = useLoader(THREE.TextureLoader, "../resources/waternormals.jpg");

    const water = new Water(
        512,
        512,
        {
            waterNormals: waterNormal,
            sunDirection: new THREE.Vector3(1, 1, 1),
            sunColor: 0xffffff,
            waterColor: 0x000000,
            distortionScale: 3.0,
        }
    );

    water.position.y = -0.5;

    return (
        <mesh>
            <meshPhongMaterial attach="material" color={0xffffff} />
            <geometry attach="geometry" />
        </mesh>
    );
};

export default ToonWater;
