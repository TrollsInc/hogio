import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from 'react-three-fiber';
import * as THREE from 'three'
import {Environment, Box, Sphere, useGLTF, useAnimations} from '@react-three/drei'
import {robot} from "../algorithms/robot";
import {Map} from "../algorithms/map";
import {RRT} from "../algorithms/rrt";
import {Group} from "three";

let mappie = new Map(false)
let startnode = mappie.get_start()
let robbie = new robot(startnode.getX(),startnode.getY(),mappie)
const speed = 0.2
let path = null
let currNode = null
let visualize = false

function runAlgo(){
    if(!visualize){
        visualize = true
        mappie = new Map(false)
        robbie =  new robot(startnode.getX(),startnode.getY(),mappie)
        RRT(mappie)
    }
}
function Robot(props) {
    // This reference gives us direct access to the THREE.Mesh object
    const ref = useRef()
    const targetPoint = useRef([mappie.width/2, mappie.height/2, 0]);
    const [shapesOnCanvas,setShapesOnCanvas] = useState([])
    useFrame(   state => {
        state.camera.lookAt(...targetPoint.current)
        if(visualize){
            path = mappie.get_smoothed_path()
            if(path!=null){
                if(currNode == null){
                    currNode = path.shift()
                }
                let goalX = currNode.getX()
                let goalY = currNode.getY()
                let vectorX = goalX-robbie.getX()
                let vectorY = goalY-robbie.getY()
                let mag = Math.sqrt(vectorX**2+vectorY**2)
                if(mag>0.1){
                    robbie.setpos([ref.current.position.x+(vectorX/mag)*speed,ref.current.position.y+(vectorY/mag)*speed])
                    ref.current.position.x += (vectorX/mag)*speed
                    ref.current.position.y += (vectorY/mag)*speed
                    ref.current.position.z = 1
                    ref.current.rotation.z = (Math.atan2(vectorY,vectorX)+Math.PI/2)

                }
                else if(path.length!==0){
                    currNode = path.shift()
                }
                else{
                    path = null
                    currNode = null
                    visualize = false
                    ref.current.position.x = startnode.getX()
                    ref.current.position.y = startnode.getY()
                    ref.current.position.z = 1
                }
            }
        }
    })

    // Return the view, these are regular Threejs elements expressed in JSX
    return (
        <mesh
            {...props}
            ref={ref}>
            <boxGeometry args={[1, 2, 1]} />
            <meshStandardMaterial color={"red"}/>
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
    const size = new THREE.Vector3(0.5,0.5,0.5)
    return (
        <group ref={groupRef}>
            {shapePositions.map((position, index) => (
                <Sphere key={index} position={position} scale={size}>
                    <meshStandardMaterial wireframe={true} color={"pink"} emissive={"orange"} emissiveIntensity={2}></meshStandardMaterial>
                </Sphere>
            ))}
        </group>
    );
};
const Scene = () =>{
    const pivot = new THREE.Group();
    const groupRef = React.useRef(new Group());

    useFrame(state => {
        let xpos = state.pointer.x
        let ref = groupRef.current.position
        let axis = new THREE.Vector3(0,0,1)
        let pivot = new THREE.Vector3(mappie.width/2,mappie.height/2,0)
        groupRef.current.position.sub(pivot)
        groupRef.current.position.applyAxisAngle(axis,xpos*0.005)
        groupRef.current.position.add(pivot)
        groupRef.current.rotateOnAxis(axis,xpos*0.005)
    })
    return (
        <group ref={groupRef}>
        <Box args={[65, 45, 1]} position={[mappie.width / 2, mappie.height / 2, 0]}>
            <meshStandardMaterial color="gray"></meshStandardMaterial>
        </Box>
        <Robot position={[robbie.getX(), robbie.getY(), 0]}/>
        <Obstacles></Obstacles>
    </group>
    )
}

function Pathing() {
    //const cameraControlRef = useRef();
    return (
        <div style={{height: "100vh"}}>
            <Canvas orthographic={false}
                    camera={{position: [mappie.width / 2, -mappie.height, 50], fov: 50}}>
                <ambientLight intensity={Math.PI / 2}/>
                <Environment preset="forest" background blur={0.5}/>
                <Scene/>
            </Canvas>
            <div>
                <h1>
                    RRT Algorithm
                </h1>
                <button onClick={runAlgo}>
                    Run Algorithm
                </button>
                <h4>
                    "Low-Poly Seagull (with Animation & Rigged)" (https://skfb.ly/orun9) by simonaskLDE is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
                </h4>
            </div>
        </div>
    );
}

export default Pathing;