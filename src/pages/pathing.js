import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from 'react-three-fiber';
import { OrbitControls } from '@react-three/drei'
import {robot} from "../algorithms/robot";
import {Map} from "../algorithms/map";
import {rrt} from "../algorithms/rrt";

let mappie = new Map(false)
let startnode = mappie.get_start()
let robbie = new robot(startnode.getX(),startnode.getY(),mappie)
let path = rrt(mappie)
function Robot(props) {
    // This reference gives us direct access to the THREE.Mesh object
    const ref = useRef()
    useFrame(({ clock }) => {
        ref.current.position.x = robbie.getX()
        ref.current.position.y = robbie.getY()
        ref.current.position.z = 0
        // if(dist>0){
        //     dist -= 0.05
        //     robbie.move(0.05)
        // }
        ref.current.rotation.x = clock.getElapsedTime()
    })

    // Return the view, these are regular Threejs elements expressed in JSX
    return (
        <mesh
            {...props}
            ref={ref}>
            <boxGeometry args={[1, 1, 1]} />
            <meshNormalMaterial />
        </mesh>
    )
}



function Pathing() {
    return (
        <div style={{height: 500}}>
            <Canvas camera={{ position: [1, 2, 3] }}>
                <ambientLight intensity={Math.PI / 2}/>
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI}/>
                <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI}/>
                <Robot position = {[robbie.getX(),robbie.getY(),0]}/>
                <OrbitControls />
                <gridHelper rotation-x={Math.PI / 4} args={[100, 100]}/>
            </Canvas>
        </div>
    );
}

export default Pathing;