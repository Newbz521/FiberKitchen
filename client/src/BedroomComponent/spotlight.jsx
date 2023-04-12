import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const Spotlight = ({ position }) => {
  const spotlightRef = useRef()
  const targetRef = useRef()

  useFrame(() => {
    // Position the target directly below the spotlight
    targetRef.current.position.set(position[0], position[1] - 1, position[2])
    
    // Set the spotlight's target to the target object
    spotlightRef.current.target = targetRef.current
  })

  return (
    <>
      <spotLight ref={spotlightRef} position={position} angle={Math.PI / 4} penumbra={0.1} />
      <mesh ref={targetRef} position={[position[0], position[1] - 1, position[2]]}>
        <sphereBufferGeometry args={[0.1, 32, 32]} />
        <meshBasicMaterial color="white" />
      </mesh>
    </>
  )
}

export default Spotlight
