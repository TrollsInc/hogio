import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from 'react-three-fiber';
import * as THREE from 'three'
import {OrbitControls, Plane, CameraControls, OrthographicCamera, Box} from '@react-three/drei'
import {robot} from "../algorithms/robot";
import {Map} from "../algorithms/map";
import {RRT} from "../algorithms/rrt";
import {Group, Vector3} from "three";
import {getDist} from "../algorithms/utils";
import {PI} from "three/examples/jsm/nodes/math/MathNode";
import {cameraPosition} from "three/examples/jsm/nodes/accessors/CameraNode";

let mappie = new Map(false)
let startnode = mappie.get_start()
let robbie = new robot(startnode.getX(),startnode.getY(),mappie)
RRT(mappie)
let path = mappie.get_smoothed_path()
let currNode = path.shift()
const speed = 0.1
function Robot(props) {
    // This reference gives us direct access to the THREE.Mesh object
    const ref = useRef()
    const targetPoint = useRef([mappie.width/2, mappie.height/2, 0]);
    const [shapesOnCanvas,setShapesOnCanvas] = useState([])
    useFrame(   state => {
        let goalX = currNode.getX()
        let goalY = currNode.getY()
        let vectorX = goalX-robbie.getX()
        let vectorY = goalY-robbie.getY()
        let mag = Math.sqrt(vectorX**2+vectorY**2)
        state.camera.lookAt(...targetPoint.current)
        if(mag>0.05){
            robbie.setpos([ref.current.position.x+(vectorX/mag)*speed,ref.current.position.y+(vectorY/mag)*speed])
            ref.current.position.x += (vectorX/mag)*speed
            ref.current.position.y += (vectorY/mag)*speed
            ref.current.position.z = 1
            ref.current.rotation.z = (Math.atan2(vectorY,vectorX)+Math.PI/2)

        }
        else if(path.length!==0){
            currNode = path.shift()
        }

    })

    // Return the view, these are regular Threejs elements expressed in JSX
    return (
        <mesh
            {...props}
            ref={ref}>
            <boxGeometry args={[2.5, 4, 1]} />
            <meshNormalMaterial />
        </mesh>
    )
}
const Obstacles = () => {
    // Define your array of shape positions
    const shapePositions = [];
    for(let i = 0;i<mappie.obstacles.length;i++){
        let obstacle = mappie.obstacles[i]
        for(let k = 0;k< obstacle.length;k++){
            let node = obstacle[k]
            shapePositions.push([node.getX(),node.getY(),1])
        }
    }

    // Create a group to contain the shapes
    const groupRef = React.useRef(new Group());

    return (
        <group ref={groupRef}>
            {shapePositions.map((position, index) => (
                <Box key={index} position={position} />
            ))}
        </group>
    );
};


function Pathing() {
    //const cameraControlRef = useRef();
    return (
        <div style={{height:"100vh"}}>
            <Canvas orthographic={false} camera={{position: [mappie.width/2,-mappie.height,50], fov:50}}>
                <Box args={[65, 45, 1]} position={[mappie.width / 2, mappie.height / 2, 0]}>
                    <meshStandardMaterial color="gray"></meshStandardMaterial>
                </Box>
                <ambientLight intensity={Math.PI / 2}/>
                <Robot position={[robbie.getX(), robbie.getY(), 0]}/>
                <Obstacles></Obstacles>
                {/*<OrbitControls/>*/}
            </Canvas>
            <div>
                <h1>
                    RRT Algorithm
                </h1>
            </div>
        </div>
    );
}

export default Pathing;