import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from 'react-three-fiber';
import { OrbitControls } from '@react-three/drei'
let rotVal= Math.random()/50
function Box(props) {
    // This reference gives us direct access to the THREE.Mesh object
    const ref = useRef()
    // Hold state for hovered and clicked events
    const [hovered, hover] = useState(false)
    const [clicked, click] = useState(false)
    if(clicked){
        rotVal = Math.random()/50
    }
    // Subscribe this component to the render-loop, rotate the mesh every frame
    useFrame((state, delta) =>
        (ref.current.rotation.x += clicked? rotVal: -rotVal,
            ref.current.rotation.y += clicked? rotVal: -rotVal,
            ref.current.rotation.z += clicked? rotVal: -rotVal))
    // Return the view, these are regular Threejs elements expressed in JSX
    return (
        <mesh
            {...props}
            ref={ref}
            scale={clicked ? 1.5 : 1}
            onClick={(event) => click(!clicked)}
            onPointerOver={(event) => hover(true)}
            onPointerOut={(event) => hover(false)}>
            <boxGeometry args={[1, 1, 1]} />
            <meshNormalMaterial color={hovered ? 'hotpink' : 'white'} />
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
                <Box position={[-1.2, 0, 0]}/>
                <Box position={[1.2, 0, 0]}/>
                <OrbitControls />
                <gridHelper rotation-x={Math.PI / 4} args={[20, 20]}/>
            </Canvas>
        </div>
    );
}

export default Pathing;