import React, {useRef, useState} from 'react'
import {Canvas, useFrame} from 'react-three-fiber';
import * as THREE from 'three'
import {Environment, Box, Sphere, useGLTF, Clone, Stats, Cone} from '@react-three/drei'
import {robot} from "../algorithms/robot";
import {Map} from "../algorithms/map";
import {RRT} from "../algorithms/rrt";
import {Group} from "three";

let mappie = new Map(false)
let startnode = mappie.get_start()
let robbie = new robot(startnode.getX(),startnode.getY(),mappie)
const speed = 0.15
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
                if(mag>0.16){
                    robbie.setpos([ref.current.position.x+(vectorX/mag)*speed,ref.current.position.y+(vectorY/mag)*speed])
                    ref.current.position.x += (vectorX/mag)*speed
                    ref.current.position.y += (vectorY/mag)*speed
                    ref.current.position.z = 10
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
                    ref.current.position.z = 10
                }
            }
        }
    })

    const seagull = useGLTF('seagull.glb');
    return (
        <mesh
            {...props}
            ref={ref}>
            <primitive object={seagull.scene} scale={.1}/>
        </mesh>
    )
}
const Obstacles = () => {
    // Define your array of shape positions
    const shapePositions = [];
    const trees = [];
    const goals = [];
    let xsum = 0
    let ysum = 0
    for(let i = 0;i<mappie.obstacles.length;i++){
        let obstacle = mappie.obstacles[i]
        let length = obstacle.length
        for(let k = 0;k< obstacle.length;k++){
            let node = obstacle[k]
            shapePositions.push([node.getX(),node.getY(),1])
            xsum+=node.getX()
            ysum+=node.getY()
        }
        trees.push([xsum/length,ysum/length,7])
        xsum=0
        ysum=0
    }
    for(let i = 0;i<mappie.goals.length;i++){
        let goal = mappie.goals[i]
        goals.push([goal.getX(),goal.getY(),0])
    }
    console.log(goals.length,"goals")
    // Create a group to contain the shapes
    const groupRef = React.useRef(new Group());
    const size = new THREE.Vector3(0.5,0.5,0.5)
    const tree = useGLTF('tree_gh.glb');
    const flag = useGLTF('flag.glb')
    return (
        <group ref={groupRef}>
            {trees.map((position, index) => (
                <mesh position={position} key={index} rotation={[Math.PI / 2, Math.random() * Math.PI, 0]}>
                    <Clone object={tree.scene} scale={.02} castShadow={true}/>
                </mesh>
            ))}
            {shapePositions.map((position, index) => (
                <Sphere key={index} position={position} scale={size}>
                    <meshStandardMaterial wireframe={true} color={"pink"} emissive={"orange"} emissiveIntensity={2}></meshStandardMaterial>
                </Sphere>
            ))}
            {goals.map((position, index) => (
                <mesh position={position} key={index} rotation={[Math.PI/2,Math.PI*Math.random(),0]}>
                    <primitive object={flag.scene}></primitive>
                </mesh>
            ))}
        </group>
    );
};
const Arrows = (nodePaths) => {
    let arrowDetails = []
    if (nodePaths !== undefined && nodePaths != null) {
        for (let i = 0; i < nodePaths.length; i++){
            if(nodePaths[i]!=null && nodePaths[i].length===2 && nodePaths[i]!==undefined){
                try {
                    let startNode = mappie.node_paths[i][0]
                    let endNode = mappie.node_paths[i][1]
                    let xdiff = endNode.getX()-startNode.getX()
                    let ydiff = endNode.getY()-startNode.getY()
                    let mag = Math.sqrt(xdiff**2+ydiff**2)
                    let vector = new THREE.Vector3(xdiff/mag,ydiff/mag,0)
                    arrowDetails.push([vector,new THREE.Vector3(startNode.getX(),startNode.getY(),1),mag,"red"])
                } catch (error) {
                    console.error(error);
                }

            }
        }
        return(
            <>
                {arrowDetails.map((info, index) => (
                    <arrowHelper key ={index} args={info}></arrowHelper>
                ))}
            </>
        )
    }
    else{
        return(
            <></>
        )
    }
}
const Scene = () =>{
    const groupRef = React.useRef(new Group());
    const [paths,setPaths] = useState(mappie.node_paths)
    let arrows = Arrows(paths)
    useFrame(state => {
        let xpos = state.pointer.x
        let axis = new THREE.Vector3(0,0,1)
        let pivot = new THREE.Vector3(mappie.width/2,mappie.height/2,0)
        groupRef.current.position.sub(pivot)
        groupRef.current.position.applyAxisAngle(axis,xpos*0.01)
        groupRef.current.position.add(pivot)
        groupRef.current.rotateOnAxis(axis,xpos*0.01)
        if(mappie.node_paths!==paths && mappie.node_paths!=null){
            setPaths(mappie.node_paths)
            arrows = Arrows(paths)
        }
        if(arrows===undefined || arrows==null){
            arrows=<></>
        }
    })
    return (
        <group ref={groupRef}>
            <Box args={[mappie.width, mappie.height, 1]} position={[mappie.width / 2, mappie.height / 2, 0]}>
                <meshStandardMaterial color="lightgreen"></meshStandardMaterial>
            </Box>
            <Robot position={[robbie.getX(), robbie.getY(), 0]}/>
            <Obstacles/>
            {arrows}
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
                    <button onClick={runAlgo} className={"algoButton"}>
                        Run Algorithm
                    </button>
                </h1>
                <h4 align={"left"}>
                    "Low-Poly Seagull (with Animation & Rigged)" (https://skfb.ly/orun9) by simonaskLDE is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
                    "Tree G&H" (https://skfb.ly/6TMoo) by MikeDragneel is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
                </h4>
            </div>
        </div>
    );
}

export default Pathing;