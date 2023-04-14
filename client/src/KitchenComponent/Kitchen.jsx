import React, { Component } from "react";
import { useEffect, useState, useRef } from "react";
import { Canvas, useFrame, useThree, PerspectiveCamera} from "@react-three/fiber"
import Chrome from "./materials/chrome.jpeg"
import WengeVertical from "./materials/WengeVertical.jpeg"
import LightWoodVertical from "./materials/light-wood-vertical.jpeg"
import Marble from "./materials/streaked-marble.png"
import lightChrome from "./materials/lightChrome.jpeg"
import { Mesh, TextureLoader } from "three"
import Spotlight from "./spotlight";
import { Stats, OrbitControls } from "@react-three/drei"
import SelectSearch from 'react-select-search'
import Wenge from "./materials/Wenge.jpeg"
import LK55H from "./materials/lk55-h.png"
import WhiteWood from "./materials/White-Wood.jpeg"
import CherryWood from "./materials/Spicy-Cherry.jpeg"
import LK55HLong from "./materials/lk55-h-Long.png"
import WhiteWoodLong from "./materials/White-Wood-Long.jpeg"
import CherryWoodLong from "./materials/Spicy-Cherry-Long.jpeg"
import DarkMarble from "./materials/dark-marble.jpeg"
import MarbleTwo from "./materials/marble-2.jpeg"
import "./kitchen.css"

const KitchenScene = (props) => {
  const [kitchenLength, setKitchenLength] = useState(9);
  const [kitchenDepth, setKitchenDepth] = useState(9);
  const [cabinets, setCabinets] = useState([3, 3, 3]);
  const [cabinetMaterial, setCabinetMaterial] = useState(WengeVertical)
  const [tableMaterial, setTableMaterial] = useState(Marble)
  const [tableBottomMaterial, setTableBottomMaterial] = useState(Wenge)
  const [stoveMaterial, setStoveMaterial] = useState(lightChrome)
  const [toggle, setToggle] = useState(true)
  const [wired, setWired] = useState(false)
  const [staticIso, setStaticIso] = useState(false)
  const [cam, setCam] = useState(-13)
  const loader = new TextureLoader();
  const chromeTexture = loader.load(Chrome)
  const verticalWoodTexture = loader.load(cabinetMaterial)
  const marbleTexture = loader.load(tableMaterial)
  const woodTexture = loader.load(tableBottomMaterial)
  const stoveTexture = loader.load(stoveMaterial)
  let bottomLength =  (kitchenLength - 2) - 1.5/12
  const materials = [{name:"LK55", value: LK55H},{name:"Oak Wood", value: WengeVertical},{name:"Spicy Cherry", value: CherryWood}, {name:"White Wood", value: WhiteWood}];
  const bottomMaterials = [{name:"LK55", value: LK55HLong},{name:"Oak Wood", value: Wenge},{name:"Spicy Cherry", value: CherryWoodLong}, {name:"White Wood", value: WhiteWoodLong}];
  const marbleMaterials = [{name:"Dark Marble", value: DarkMarble},{name:"White Marble", value: Marble},{name:"Marble-2", value: MarbleTwo}];
  const [slideIn, setSlideIn] = useState({ transform: "translate(-100vw, 0%)" });
  const [toggler, setToggler] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [currentDisplay, setCurrentDisplay] = useState(null)
  const [showModal, setShowModal] = useState({ display: "none" })
  const [modalCam, setModalCam] = useState(0);
  const [description, setDescription] = useState(null)
  const [furniture, setFurniture] = useState(null)
  

useEffect(() => {
  document.body.style.cursor = hovered ? 'pointer' : 'auto'
}, [hovered])
  
  function handleShow() {
    if (toggler == true) {
      // setShow("");
      setSlideIn({ transform: "translate(-100vw, 0%)" });
    } else {
      setSlideIn({ transform: "translate(0%, 0%)" });
    }
    setToggler((prevCheck) => !prevCheck);
  }


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
      meshRef.current.receiveShadow = true;
      meshRef.current.castShadow = true;
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
    const volumeRef = useRef(null);
    const leftRef = useRef(null);
    const rightRef = useRef(null);
    const bottomRef = useRef(null);
    let isWired = false;
    useFrame(() => {
      volumeRef.current.position.y = 3.5;
      volumeRef.current.position.z = -(kitchenDepth / 2) + 1.5;
      volumeRef.current.position.x = (-kitchenLength / 2 - (1.8))
      volumeRef.current.castShadow = true;
      volumeRef.current.receiveShadow = true;
      volumeRef.current.material.wireframe = isWired;

      leftRef.current.position.y = 4/2 + 2.5/2 + 1.6;
      leftRef.current.position.z = -(kitchenDepth / 2) + 3 + 3/24 ;
      leftRef.current.position.x = (-kitchenLength / 2 - (1.8) - 20 / 24);
      leftRef.current.castShadow = true;
      leftRef.current.receiveShadow = true;
      leftRef.current.material.wireframe = isWired;

      rightRef.current.position.y = 4/2 + 2.5/2 + 1.6;
      rightRef.current.position.z = -(kitchenDepth / 2) + 3 + 3/24 ;
      rightRef.current.position.x = (-kitchenLength / 2 - (1.8) + 20 / 24);
      rightRef.current.castShadow = true;
      rightRef.current.receiveShadow = true;
      rightRef.current.material.wireframe = isWired;

      bottomRef.current.position.y = 2.5/2 + 1/12;
      bottomRef.current.position.z = -(kitchenDepth / 2) + 1.5 + 1.5 + 3/24 ;
      bottomRef.current.position.x = (-kitchenLength / 2 - (1.8))
      bottomRef.current.castShadow = true;
      bottomRef.current.receiveShadow = true;
      bottomRef.current.material.wireframe = isWired;

    })
    return (
      <>
      <mesh ref={volumeRef} onPointerOver={() => { setHovered(true); setWired(true); isWired = true }}
          onPointerOut={() => { setHovered(false); setWired(false); isWired = false }}
        >
        <boxGeometry args={[40/ 12, 7, 3]} />
        <meshMatcapMaterial matcap={chromeTexture} />
        </mesh>
        <mesh ref={leftRef}>
        <boxGeometry args={[19/ 12, 4.3, 3/12]} />
        <meshMatcapMaterial matcap={chromeTexture} />
        </mesh>
        <mesh ref={rightRef}>
        <boxGeometry args={[19/ 12, 4.3, 3/12]} />
        <meshMatcapMaterial matcap={chromeTexture} />
        </mesh>
        <mesh ref={bottomRef}>
        <boxGeometry args={[39/ 12, 2.5, 3/12]} />
        <meshMatcapMaterial matcap={chromeTexture} />
      </mesh>
      </>
    )
  }


  function CounterTop() {
    const oneRef = useRef(null)
    const twoRef = useRef(null)
    useFrame(() => { 
      oneRef.current.position.z = -(kitchenDepth / 2) + 1.1;
      oneRef.current.position.y = 3 + 1.5 / 24
      oneRef.current.receiveShadow = true;
      oneRef.current.castShadow = true;

      twoRef.current.position.z = -(kitchenDepth / 2) + 1;
      twoRef.current.position.y = 1.5
      twoRef.current.receiveShadow = true;
      twoRef.current.castShadow = true;
    })
    return (
      <>
      <group ref={oneRef} >
        <mesh receiveShadow castShadow ref={oneRef}> 
          <boxGeometry args={[kitchenLength, 1.5/12, 2.2]} /> 
          <meshStandardMaterial map={marbleTexture} />
        </mesh>
        </group>
        <group ref={twoRef} >
        <mesh receiveShadow castShadow ref={twoRef} > 
          <boxGeometry args={[ kitchenLength, 3, 2 ]} /> 
          <meshStandardMaterial map={woodTexture} />
        </mesh>
        </group>
      </>
    )
  }
  function CounterTopTwo() {
    const oneRef = useRef(null)
    const twoRef = useRef(null)
    useFrame(() => { 
      oneRef.current.position.y = 3 + 1.5/24;
      oneRef.current.position.z = 0;
      oneRef.current.position.x = (kitchenLength / 2) - 1.1;
      oneRef.current.receiveShadow = true;
      oneRef.current.castShadow = true;

      twoRef.current.position.y = 1.5
      twoRef.current.position.z = 0;
      twoRef.current.position.x = (kitchenLength / 2) - 1;
      twoRef.current.receiveShadow = true;
      twoRef.current.castShadow = true;
    })
    return (
      <>
      <group ref={oneRef} receiveShadow castShadow>
        <mesh receiveShadow castShadow> 
          <boxGeometry args={[2.2, 1.5/12, kitchenDepth]} /> 
          <meshStandardMaterial map={marbleTexture} />
        </mesh>
      </group>
      <group ref={twoRef} receiveShadow castShadow>
              <mesh receiveShadow castShadow> 
                <boxGeometry args={[2, 3, kitchenDepth ]} /> 
                <meshStandardMaterial map={woodTexture} />
              </mesh>
        </group>
        </>
    )
  }
  function CounterTopThree() {
    const oneRef = useRef(null)
    const twoRef = useRef(null)
    const threeRef = useRef(null)
    useFrame(() => { 
      oneRef.current.position.x = kitchenLength/2 - (kitchenLength/2 + 1)
      oneRef.current.position.y = 3 + 1.5/24
      oneRef.current.position.z = kitchenDepth/2 - kitchenDepth/6 
      oneRef.current.flatShading = true;
      oneRef.current.receiveShadow = true;
      oneRef.current.castShadow = true;

      twoRef.current.position.x = -kitchenLength/2  + 1.5/24
      twoRef.current.position.y = 1.5
      twoRef.current.position.z = kitchenDepth/2 - kitchenDepth/6 
      twoRef.current.receiveShadow = true;
      twoRef.current.castShadow = true;

      threeRef.current.position.x = kitchenLength/2 - (bottomLength/2 + 2)
      threeRef.current.position.y = 1.5
      threeRef.current.position.z = kitchenDepth / 2 - kitchenDepth / 6 - .5
      threeRef.current.receiveShadow = true;
      threeRef.current.castShadow = true;
    })
    return (
      <>
      <group ref={oneRef} >
        <mesh receiveShadow castShadow> 
          <boxGeometry  args={[ (kitchenLength - 2), 1.5/12, kitchenDepth /3 ]} /> 
          <meshStandardMaterial map={marbleTexture} />
        </mesh>
      </group>
        <group ref={twoRef} >
        <mesh receiveShadow castShadow> 
          <boxGeometry args={[1.5/12 , 3, kitchenDepth /3 ]} /> 
          <meshStandardMaterial map={marbleTexture} />
        </mesh>
        </group>
        <group ref={threeRef} >
        <mesh receiveShadow castShadow> 
          <boxGeometry args={[bottomLength, 3, kitchenDepth /3 - 1 ]} /> 
          <meshStandardMaterial map={woodTexture} />
        </mesh>
        </group>
      </>
    )
}


  function CabinetEach({ position, data, positionLeftDoor }) {
    
    const groupRef = useRef(null)
    const cabRef = useRef(null)
    const doorRef = useRef(null)
    let isWired = false
    useFrame(() => {
      cabRef.current.material.wireframe = isWired;
      doorRef.current.material.wireframe = isWired;
    })
    return (
      <>
        <mesh ref={cabRef} onClick={() => {
          setFurniture("Cabinet");
          setDescription(`
            Depth: 1 feet 
            Width: ${cabinets[0]} feet 
            Height: 4 feet
            `);
          setModalCam(0);
          setCurrentDisplay(
            <CabinetEach data={cabinets[0]} data-value={cabinets[0]} positionLeftDoor={[0, 0, (.5 + 1.5 / 24)]} />
          ); setShowModal({ display: "flex" })
        }} position={position} onPointerOver={() => { setHovered(true); setWired(true); isWired = true }}
          onPointerOut={() => { setHovered(false); setWired(false); isWired = false }}  castShadow receiveShadow>   
          <boxGeometry args={[data, 4, 1]} castShadow receiveShadow /> 
          <meshStandardMaterial  wireframeLinewidth={0.5} map={verticalWoodTexture} />
        </mesh>
        <mesh ref={doorRef} position={positionLeftDoor} castShadow receiveShadow >  
          <boxGeometry args={[data - .1, 4, 1.5 / 12]} castShadow receiveShadow/> 
          <meshStandardMaterial wireframeLinewidth={0.5} map={verticalWoodTexture}  />
        </mesh>
      </>
    )
    }

      const Lights = (positions) => {
        const lightRef = useRef()
        const targetRef = useRef()
      
        useFrame(() => {
          const position = lightRef.current.position
          targetRef.current.position.set(position.x, position.y - 1, position.z)
          lightRef.current.target = targetRef.current
          lightRef.current.angle = .9
        })
      
        return (
          <>
            <spotLight castShadow ref={lightRef} position={[positions.number, 11, -kitchenDepth/2 + 4]} color={0xffffff} intensity={1}  penumbra={0.1} />
            <mesh ref={targetRef} position={[0, 0, 0]}>
              <sphereGeometry args={[0.1, 32, 32]} />
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
          lightRef.current.angle = .7
          lightRef.current.castShadow = true
        })
      
        return (
          <>
            <spotLight castShadow ref={lightRef} position={[positions.number, 11, kitchenDepth/2 + 4  ]} color={0xffffff} intensity={1} penumbra={0.1} />
            <mesh ref={targetRef} position={[0, 0, 0]}>
              <sphereGeometry args={[0.1, 32, 32]} />
              <meshBasicMaterial color="white" />
            </mesh>
          </>
        )
      }
  
  function Appliances({x1,x2,x3,y1,y2,y3,z1,z2,z3}) {
    const oneRef = useRef(null)
    const twoRef = useRef(null)
    const threeRef = useRef(null)
    let isWired = false
    useFrame(() => {
      oneRef.current.position.x =   x1
      oneRef.current.position.y =  y1
      oneRef.current.position.z = z1
      oneRef.current.receiveShadow = true
      oneRef.current.castShadow = true
      oneRef.current.material.wireframe = isWired;

      twoRef.current.position.x =  x2
      twoRef.current.position.y = y2
      twoRef.current.position.z =  z2
      twoRef.current.receiveShadow = true
      twoRef.current.castShadow = true
      twoRef.current.material.wireframe = isWired;

      threeRef.current.position.x =   x3
      threeRef.current.position.y =  y3
      threeRef.current.position.z = z3
      threeRef.current.material.wireframe = isWired;
    })

    return (
      <>
        <mesh castShadow receiveShadow ref={oneRef} onClick={() => { setModalCam(3); setCurrentDisplay(<Appliances x1={0} y1={6 - (3 + 3 / 24)} z1={0} x2={0} y2={7.2 - (3 + 3 / 24)} z2={0} x3={0} y3={0} z3={0} />); setShowModal({ display: "flex"})}} onPointerOver={() => { setHovered(true); setWired(true); isWired = true }}
          onPointerOut={() => { setHovered(false); setWired(false); isWired = false }}  >
        <boxGeometry args={[5, 9 / 12, 1.5]} />
        <meshMatcapMaterial matcap={stoveTexture} />
        </mesh>
      <mesh castShadow receiveShadow ref={twoRef} onPointerOver={() => { setHovered(true); setWired(true); isWired = true }}
          onPointerOut={() => { setHovered(false); setWired(false); isWired = false }} >
        <cylinderGeometry args={[.5, 8 / 12, 2]} />
        <meshMatcapMaterial matcap={stoveTexture} />
        </mesh>
      <mesh castShadow receiveShadow ref={threeRef} onPointerOver={() => { setHovered(true); setWired(true); isWired = true }}
          onPointerOut={() => { setHovered(false); setWired(false); isWired = false }} >
        <boxGeometry args={[5, 1.5 / 12, 1.5]} />
        <meshMatcapMaterial matcap={chromeTexture} />
      </mesh>
      
      </>
    )
  }

  function selectCabinet(e) {
    console.log(e.target.dataset.value)
    setCabinetMaterial(e.target.dataset.value)
  }
  function selectBottom(e) {
    console.log(e.target.dataset.value)
    setTableBottomMaterial(e.target.dataset.value)
  }

  function selectMarble(e) {
    console.log(e.target.dataset.value)
    setTableMaterial(e.target.dataset.value)
  }
  return (
    <div className="canvasContainer">
    <Canvas  shadows camera={{ position: [cam, 6, 15], fov: 75 }}>
      {/* <OrbitControls/> */}
      <KitchenFloor />
      <ambientLight intensity={.5} />
      <WallOne />
      <WallTwo />
      <FridgeVolume />
      {/* <FridgeLeftDoor />
      <FridgeRightDoor />
      <FridgeBottomDoor /> */}
      {cabinets.map((data, index) => 
        (<CabinetEach data={data} data-value={data} position={[(-kitchenLength / 2 + data / 2) + (index * data), 4.5 + (2), -(kitchenDepth / 2) + .5]} positionLeftDoor={[(-kitchenLength / 2 + data / 2) + (index * data),4.5 + (2),-(kitchenDepth / 2) + 1.07]} />)
      )}
  
        {cabinets.map((data, index) => 
          (<Lights castShadow number={(-kitchenLength / 2 + data / 2) + (index * data)} />)
        )}
        {cabinets.map((data, index) => 
          (<LightsTwo castShadow number={(-kitchenLength / 2 + data / 2) + (index * data)} />)
      )}
        <CounterTop receiveShadow/>
        <CounterTopTwo receiveShadow/>
        <CounterTopThree receiveShadow />
        <Appliances x1={kitchenLength/2 - (bottomLength/2 + 2)} y1={6} z1={kitchenDepth / 2 - kitchenDepth / 6 - .75 } x2={kitchenLength/2 - (bottomLength/2 + 2)} y2={7.2} z2={kitchenDepth / 2 - kitchenDepth / 6 - .75} x3={kitchenLength/2 - (bottomLength/2 + 2)} y3={3 + 3/24} z3={kitchenDepth / 2 - kitchenDepth / 6 - .75}/>
      </Canvas>
      <div className="modal-background" style={showModal} onClick={() => setShowModal({ display: "none" })}></div>
      <div className="modal-container" style={showModal} >
      <div className="modal" >
        <Canvas shadows camera={{ position:[-6,3,6], fov: 75 }}>
            {currentDisplay}
            <ambientLight intensity={5} />
            <OrbitControls/>
        </Canvas>
        </div>
        <div className="modal-description">
          <div>
          {furniture}
          </div>
          <div>
          {description}
          </div>
        </div>
      </div>
      <div className="menu-button" onClick={handleShow}></div>
      <div className="edit-container" style={slideIn}>
      
        <div className="upper-wrap">
        Length: {kitchenLength} ft.
        <input id="length" type="range" min="9" max="15" defaultValue="6" onInput={getValue} />
        Depth: {kitchenDepth} ft.
        <input id="depth" type="range" min="9" max="15" defaultValue="6" onInput={getDepth} /> 
        </div>
        <div className="upper-wrap">   
            UP - Mat
            <div className="upper-select">
            {materials.map((data) => (
              <div className="material-box" data-value={data.value} onClick={selectCabinet} style={{ 
                backgroundImage: `url(${data.value})` 
              }}></div>
            ))}
            </div>
        </div>
      
        <div className="lower-wrap">
            LOW-MAT
            <div className="lower-select">
              {bottomMaterials.map((data) => (
              <div className="material-box" data-value={data.value} onClick={selectBottom} style={{ 
                backgroundImage: `url(${data.value})` 
              }}></div>
            ))}
            </div>
        </div>
        <div className="lower-wrap">
            MARBLE-MAT
            <div className="lower-select">
              {marbleMaterials.map((data) => (
              <div className="material-box" data-value={data.value} onClick={selectMarble} style={{ 
                backgroundImage: `url(${data.value})` 
              }}></div>
            ))}
            </div>
        </div>
      
      </div>
    </div>
  );
}


export default KitchenScene;