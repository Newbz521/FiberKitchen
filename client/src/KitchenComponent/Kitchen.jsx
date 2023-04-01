import React, { Component } from "react";
import { useEffect, useState, useRef } from "react";
import { Canvas, useFrame, useThree, PerspectiveCamera} from "@react-three/fiber"
import Chrome from "./materials/chrome.jpeg"
import WengeVertical from "./materials/WengeVertical.jpeg"
import { Mesh, TextureLoader } from "three"
import Spotlight from "./spotlight";
import {Stats, OrbitControls} from "@react-three/drei"

import "./kitchen.css"

const KitchenScene = (props) => {
  const [kitchenLength, setKitchenLength] = useState(9);
  const [kitchenDepth, setKitchenDepth] = useState(9);
  const [cabinets, setCabinets] = useState([3, 3, 3]);
  const [cabinetMaterial, setCabinetMaterial] = useState(WengeVertical)
  // const [tableMaterial, setTableMaterial] = useState(Marble)
  // const [tableBottomMaterial,setTableBottomMaterial] = useState(Wenge)
  const [toggle, setToggle] = useState(true)
  const [wired, setWired] = useState(false)
  const [staticIso, setStaticIso] = useState(false)
  const [cam, setCam] = useState(-15)
  const loader = new TextureLoader();
  const chromeTexture = loader.load(Chrome)
  const verticalWoodTexture = loader.load(cabinetMaterial)
  
  function divideLength(length, minSectionLength, maxSectionLength) {
    const numSections = Math.ceil(length / maxSectionLength);
    const sectionLength = Math.max(Math.min(length / numSections, maxSectionLength), minSectionLength);
    const result = [];
    let remainingLength = length;
    for (let i = 0; i < numSections; i++) {
      const currentSectionLength = Math.min(sectionLength, remainingLength);
      result.push(currentSectionLength);
      remainingLength -= currentSectionLength;
    }
    return result;
  }

  function getValue(e) {
    let currentValue = divideLength(e.target.value, 1, 3)
    setKitchenLength(e.target.value)
    setCabinets(currentValue)
    console.log(kitchenLength , cabinets)
  }
  function getDepth(e) {
    let currentValue = divideLength(e.target.value, 1, 3)
    setKitchenDepth(e.target.value)
  }

  function setIso() {
    setCam(-15)
  }
  function setFront() {
    setCam(0)
  }


  function KitchenFloor() {
    const meshRef = useRef(null);
    useFrame(() => {
      if (!meshRef.current) {
        return;
      }
      meshRef.current.rotation.x = -0.5 * Math.PI;
      meshRef.current.position.y = -.5;
      meshRef.current.recieveShadow = true;
    })
    return (
      <mesh ref={meshRef}>
        <boxGeometry args={[kitchenLength * 1.75, kitchenDepth * 1.5, 1]} />
        <meshStandardMaterial color="white"/>
      </mesh>
    )
  }

  function WallOne() {
    const meshRef = useRef(null);
    useFrame(() => {
      if (!meshRef.current) {
        return;
      }
      meshRef.current.rotation.y = -0.5 * Math.PI;
      meshRef.current.position.y = 4;
      meshRef.current.position.x = kitchenLength / 2 + .5;
      meshRef.current.recieveShadow = true;
      meshRef.current.receiveShadow = true;
      meshRef.current.castShadow = true;
    })
    return (
      <mesh ref={meshRef}>
        <boxGeometry args={[kitchenDepth, 10, 1]} />
        <meshStandardMaterial color="white"/>
      </mesh>
    )
  }
  function WallTwo() {
    const meshRef = useRef(null);
    useFrame(() => {
      if (!meshRef.current) {
        return;
      }
      meshRef.current.position.y = 4;
      meshRef.current.position.z = -(kitchenDepth / 2) - .5;
      meshRef.current.position.x = 0;
      meshRef.current.receiveShadow = true;
      meshRef.current.castShadow = true;
    })
    return (
      <mesh ref={meshRef}>
        <boxGeometry args={[kitchenLength * 1.75, 10, 1]} />
        <meshStandardMaterial color="white"/>
      </mesh>
    )
  }

  function FridgeVolume() {
    const meshRef = useRef(null);
    useFrame(() => {
      if (!meshRef.current) {
        return;
      }
      meshRef.current.position.y = 3.5;
      meshRef.current.position.z = -(kitchenDepth / 2) + 1.5;
      meshRef.current.position.x = (-kitchenLength / 2 - (1.8))
    })
    return (
      <mesh ref={meshRef}>
        <boxGeometry args={[40/ 12, 7, 3]} />
        <meshMatcapMaterial matcap={chromeTexture} />
      </mesh>
    )
  }
  function FridgeLeftDoor() {
    const meshRef = useRef(null);
    useFrame(() => {
      if (!meshRef.current) {
        return;
      }
      meshRef.current.position.y = 4/2 + 2.5/2 + 1.6;
      meshRef.current.position.z = -(kitchenDepth / 2) + 3 + 3/24 ;
      meshRef.current.position.x = (-kitchenLength / 2 - (1.8) - 20 / 24);
    })
    return (
      <mesh ref={meshRef}>
        <boxGeometry args={[19/ 12, 4.3, 3/12]} />
        <meshMatcapMaterial matcap={chromeTexture} />
      </mesh>
    )
  }

  function FridgeRightDoor() {
    const meshRef = useRef(null);
    useFrame(() => {
      if (!meshRef.current) {
        return;
      }
      meshRef.current.position.y = 4/2 + 2.5/2 + 1.6;
      meshRef.current.position.z = -(kitchenDepth / 2) + 3 + 3/24 ;
      meshRef.current.position.x = (-kitchenLength / 2 - (1.8) + 20 / 24);
    })
    return (
      <mesh ref={meshRef}>
        <boxGeometry args={[19/ 12, 4.3, 3/12]} />
        <meshMatcapMaterial matcap={chromeTexture} />
      </mesh>
    )
  }

  function FridgeBottomDoor() {
    const meshRef = useRef(null);
    useFrame(() => {
      if (!meshRef.current) {
        return;
      }
      meshRef.current.position.y = 2.5/2 + 1/12;
      meshRef.current.position.z = -(kitchenDepth / 2) + 1.5 + 1.5 + 3/24 ;
      meshRef.current.position.x = (-kitchenLength / 2 - (1.8) )
    })
    return (
      <mesh ref={meshRef}>
        <boxGeometry args={[39/ 12, 2.5, 3/12]} />
        <meshMatcapMaterial matcap={chromeTexture} />
      </mesh>
    )
  }


  function CabinetEach({position,data, positionLeftDoor}) {
    
    const groupRef = useRef(null)
    useFrame(() => { 

    })
    return (
      <group ref={groupRef} >
        <mesh position={position} > 
          <boxGeometry args={[data, 4, 1]} /> 
          <meshStandardMaterial map={verticalWoodTexture} />
        </mesh>
        <mesh position={positionLeftDoor} > 
          <boxGeometry args={[data - .2, 4, 1.5 / 12]} /> 
          <meshStandardMaterial map={verticalWoodTexture} />
        </mesh>
      </group>
    )
    }


  
      const Lights = (positions) => {
        const lightRef = useRef()
        const targetRef = useRef()
      
        useFrame(() => {
          const position = lightRef.current.position
          targetRef.current.position.set(position.x, position.y - 1, position.z)
          lightRef.current.target = targetRef.current
          lightRef.current.angle = .5
        })
      
        return (
          <>
            <spotLight ref={lightRef} position={[positions.number, 15, -kitchenDepth/2 + 4]} color="white" intensity={0.9}  penumbra={0.1} />
            <mesh ref={targetRef} position={[0, 0, 0]}>
              <sphereBufferGeometry args={[0.1, 32, 32]} />
              <meshBasicMaterial color="white" />
            </mesh>
          </>
        )
      }
      const LightsTwo = (positions) => {
        const lightRef = useRef()
        const targetRef = useRef()
      
        useFrame(() => {
          const position = lightRef.current.position
          targetRef.current.position.set(position.x, position.y - 1, position.z)
          lightRef.current.target = targetRef.current
          lightRef.current.angle = .5
        })
      
        return (
          <>
            <spotLight ref={lightRef} position={[positions.number, 15, kitchenDepth/2 ]} color="white" intensity={0.9}  penumbra={0.1} />
            <mesh ref={targetRef} position={[0, 0, 0]}>
              <sphereBufferGeometry args={[0.1, 32, 32]} />
              <meshBasicMaterial color="white" />
            </mesh>
          </>
        )
      }
      
  return (
    <div className="canvasContainer">
    <Canvas  camera={{ position: [cam, 5.5, 15] }}>
      <OrbitControls/>
      <KitchenFloor />
      <ambientLight intensity={.3} />
      <WallOne recieveShadow/>
      <WallTwo recieveShadow/>
      <FridgeVolume />
      <FridgeLeftDoor />
      <FridgeRightDoor />
      <FridgeBottomDoor />
      {cabinets.map((data, index) => 
        (<CabinetEach data={data} position={[(-kitchenLength / 2 + data / 2) + (index * data), 4.5 + (2), -(kitchenDepth / 2) + .5]} positionLeftDoor={[(-kitchenLength / 2 + data / 2) + (index * data),4.5 + (2),-(kitchenDepth / 2) + 1.07]} />)
      )}
      {/* {cabinets.map((data, index) => 
        (<LightRowOne index={index} data={data} position={[(-kitchenLength / 2 + data / 2) + (index * data), 15, -kitchenDepth/2 + 4]} />)
        )}
      {cabinets.map((data, index) => 
        (<LightRowTwo index={index} data={data} position={[(-kitchenLength / 2 + data / 2) + (index * data), 15, kitchenDepth/2 + 6 ]} />)
        )} */}
        {cabinets.map((data, index) => 
          (<Lights number={(-kitchenLength / 2 + data / 2) + (index * data)} />)
        )}
        {cabinets.map((data, index) => 
          (<LightsTwo number={(-kitchenLength / 2 + data / 2) + (index * data)} />)
      )}
  
    </Canvas>

      <div className="edit-container">
        length
        <input id="length" type="range" min="9" max="15" defaultValue="6" onInput={getValue} />
        width
        <input id="depth" type="range" min="9" max="15" defaultValue="6" onInput={getDepth} /> 
        <button id="front-camera" onClick={setFront}>Front Elevation</button>
        <button id="iso-camera" onClick={setIso}>Isometric View</button>
      </div>
    </div>
  );
}


export default KitchenScene;