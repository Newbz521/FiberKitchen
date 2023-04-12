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
import {Union, Subtract} from 'modeler-csg'
// import Wenge from "./materials/Wenge.jpeg"
// import LK55H from "./materials/lk55-h.png"
// import WhiteWood from "./materials/White-Wood.jpeg"
// import CherryWood from "./materials/Spicy-Cherry.jpeg"
// import LK55HLong from "./materials/lk55-h-Long.png"
// import WhiteWoodLong from "./materials/White-Wood-Long.jpeg"
// import CherryWoodLong from "./materials/Spicy-Cherry-Long.jpeg"
// import DarkMarble from "./materials/dark-marble.jpeg"
// import MarbleTwo from "./materials/marble-2.jpeg"
import "./kitchen.css"
const { Model } = require("modeler-csg");

const Bedroom = (props) => {
  const [kitchenLength, setKitchenLength] = useState(12);
  const [kitchenDepth, setKitchenDepth] = useState(12);
  const [cabinets, setCabinets] = useState([3, 3, 3,3]);
  // const [cabinetMaterial, setCabinetMaterial] = useState(WengeVertical)
  // const [tableMaterial, setTableMaterial] = useState(Marble)
  // const [tableBottomMaterial, setTableBottomMaterial] = useState(Wenge)
  // const [stoveMaterial, setStoveMaterial] = useState(lightChrome)
  const [toggle, setToggle] = useState(true)
  const [wired, setWired] = useState(false)
  const [staticIso, setStaticIso] = useState(false)
  const [cam, setCam] = useState(-13)
  const loader = new TextureLoader();
  // const chromeTexture = loader.load(Chrome)
  // const verticalWoodTexture = loader.load(cabinetMaterial)
  // const marbleTexture = loader.load(tableMaterial)
  // const woodTexture = loader.load(tableBottomMaterial)
  // const stoveTexture = loader.load(stoveMaterial)
  let bottomLength =  (kitchenLength - 2) - 1.5/12
  // const materials = [{name:"LK55", value: LK55H},{name:"Oak Wood", value: WengeVertical},{name:"Spicy Cherry", value: CherryWood}, {name:"White Wood", value: WhiteWood}];
  // const bottomMaterials = [{name:"LK55", value: LK55HLong},{name:"Oak Wood", value: Wenge},{name:"Spicy Cherry", value: CherryWoodLong}, {name:"White Wood", value: WhiteWoodLong}];
  // const marbleMaterials = [{name:"Dark Marble", value: DarkMarble},{name:"White Marble", value: Marble},{name:"Marble-2", value: MarbleTwo}];
  const [slideIn, setSlideIn] = useState({ transform: "translate(-60vw, 0%)" });
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
      setSlideIn({ transform: "translate(-60vw, 0%)" });
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
        <boxGeometry args={[kitchenLength , kitchenDepth , 1]} />
        <meshStandardMaterial color="white"/>
      </mesh>
    )
  }
  function Bed() {
    const meshRef = useRef(null);
    useFrame(() => {
      if (!meshRef.current) {
        return;
      }

      meshRef.current.position.y = 1;
      meshRef.current.position.x = 0;
      meshRef.current.receiveShadow = true;
      meshRef.current.castShadow = true;

    })
    return (
      <mesh ref={meshRef}>
        <boxGeometry args={[4.5, 2, 6.5]} />
        <meshStandardMaterial color="grey" />
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
      <>
      <mesh ref={meshRef}>
        <boxGeometry args={[kitchenDepth, 10, 1]} />
        <meshStandardMaterial color="white"/>
      </mesh>
      </>
    )
  }
  const WallWindow = () => {
    return (
      <mesh>
        <Subtract >
          <boxGeometry  />
          <sphereGeometry  />
        </Subtract>
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
        <boxGeometry args={[kitchenLength, 10, 1]} />
        <meshStandardMaterial color="white"/>
      </mesh>
    )
  }

      const Lights = (positions) => {
        const lightRef = useRef()
        const targetRef = useRef()
      
        useFrame(() => {
          const position = lightRef.current.position
          targetRef.current.position.set(position.x, position.y - 1, position.z)
          lightRef.current.target = targetRef.current
          lightRef.current.angle = 1
          lightRef.current.penumbra = .1
        })
      
        return (
          <>
            <spotLight castShadow ref={lightRef} position={[positions.number, 10, -kitchenDepth/2 + 3]} color={0xffffff} intensity={1}  penumbra={0.1} />
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
          lightRef.current.angle = 1
          lightRef.current.castShadow = true
          lightRef.current.penumbra = .1
        })
      
        return (
          <>
            <spotLight castShadow ref={lightRef} position={[positions.number, 10, kitchenDepth/2 - 3  ]} color={0xffffff} intensity={1} penumbra={0.1} />
            <mesh ref={targetRef} position={[0, 0, 0]}>
              <sphereGeometry args={[0.1, 32, 32]} />
              <meshBasicMaterial color="white" />
            </mesh>
          </>
        )
      }

  // function selectCabinet(e) {
  //   console.log(e.target.dataset.value)
  //   setCabinetMaterial(e.target.dataset.value)
  // }
  // function selectBottom(e) {
  //   console.log(e.target.dataset.value)
  //   setTableBottomMaterial(e.target.dataset.value)
  // }

  // function selectMarble(e) {
  //   console.log(e.target.dataset.value)
  //   setTableMaterial(e.target.dataset.value)
  // }
  return (
    <div className="canvasContainer">
    <Canvas  shadows camera={{ position: [cam, 6, 15], fov: 75 }}>
      {/* <OrbitControls/> */}
      <KitchenFloor />
        <ambientLight intensity={.5} />
      <Bed/>
      <WallOne />
      <WallTwo />
        {cabinets.map((data, index) => 
          (<Lights castShadow number={(-kitchenLength / 2 + data / 2) + (index * data)} />)
        )}
        {cabinets.map((data, index) => 
          (<LightsTwo castShadow number={(-kitchenLength / 2 + data / 2) + (index * data)} />)
      )}

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
        <input id="length" type="range" min="12" max="20" defaultValue="6" onInput={getValue} />
        Depth: {kitchenDepth} ft.
        <input id="depth" type="range" min="12" max="20" defaultValue="6" onInput={getDepth} /> 
        </div>
        {/* <div className="upper-wrap">
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
            </div> */}
        {/* </div> */}
      
      </div>
    </div>
  );
}


export default Bedroom;