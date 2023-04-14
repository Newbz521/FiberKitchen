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
import { Union, Subtract } from 'modeler-csg'
import BedVertical from "./BedVertical.png"
import BedHorizontal from "./BedHorizontal.png"
import Map from "./map";
import "./bedroom.css"


const Bedroom = (props) => {
  const [kitchenLength, setKitchenLength] = useState(10);
  const [kitchenDepth, setKitchenDepth] = useState(10);
  const [cabinets, setCabinets] = useState([3.3, 3.3, 3.3]);
  const [toggle, setToggle] = useState(true)
  const [wired, setWired] = useState(false)
  const [staticIso, setStaticIso] = useState(false)
  const [cam, setCam] = useState(-13)
  let bottomLength =  (kitchenLength - 2) - 1.5/12
  const [slideIn, setSlideIn] = useState({ transform: "translate(-60vw, 0%)" });
  const [toggler, setToggler] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [currentDisplay, setCurrentDisplay] = useState(null)
  const [showModal, setShowModal] = useState({ display: "none" })
  const [modalCam, setModalCam] = useState(0);
  const [description, setDescription] = useState(null)
  const [furniture, setFurniture] = useState(null)
  const [floorLength, setFloorLength] = useState(15)
  const [floorDepth, setFloorDepth] = useState(15)
  const [floorLengthStart, setFloorLengthStart] = useState(5)
  const [floorDepthStart, setFloorDepthStart] = useState(5)
  const [innerLength, setInnerLength] = useState(10)
  const [innerDepth, setInnerDepth] = useState(10)
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [bedX, setBedX] = useState(0)
  const [bedZ, setBedZ] = useState(0)
  const [planColStart, setPlanColStart] = useState(1)
  const [planColEnd, setPlanColEnd] = useState(5)
  const [planRowStart, setPlanRowStart] = useState(1)
  const [planRowEnd, setPlanRowEnd] = useState(7)
  const [newCol,setNewCol] = useState(4)
  const [newRow, setNewRow] = useState(6)
  const [rotated, setRotated] = useState(false)
  const [meshBedRotate, setMeshBedRotate] = useState(0)
  const [meshBedX, setMeshBedX] = useState(2)
  const [meshBedY, setMeshBedY] = useState(3)
  const [bedImage, setBedImage] = useState(BedVertical)
  
  function rotateBed(){
    if (rotated == true) {
      // setShow("");
      setPlanColEnd(5)
      setPlanRowEnd(7)
      setNewCol(4)
      setNewRow(6)
      setMeshBedX(2)
      setMeshBedY(3)
      setMeshBedRotate(0)
      setBedImage(BedVertical)
    } else {
      setPlanColEnd(7)
      setPlanRowEnd(5)
      setNewCol(6)
      setNewRow(4)
      setMeshBedX(3)
      setMeshBedY(2)
      setMeshBedRotate((-0.5 * Math.PI))
      setBedImage(BedHorizontal)
    }
    setRotated((prevCheck) => !prevCheck);
  }


  const childRef = useRef(null);
  const parentRef = useRef(null);

  const handleMouseDown = (event) => {
    setIsDragging(true);
    setOffset({
      x: childRef.current.offsetLeft - event.clientX,
      y: childRef.current.offsetTop - event.clientY
    });
  };

  const handleMouseMove = (event) => {
    if (isDragging) {
      const parentRect = parentRef.current.getBoundingClientRect();
  
      // calculate the nearest grid cell based on the current mouse position
      const cellWidth = parentRect.width / props.innerLength;
      const cellHeight = parentRect.height / props.innerDepth;
      const newLeft = Math.floor((event.clientX - parentRect.left) / cellWidth) * cellWidth;
      const newTop = Math.floor((event.clientY - parentRect.top) / cellHeight) * cellHeight;
  
      // calculate the grid start and end positions for the child div based on the nearest grid cell
      const columnStart = Math.floor(newLeft / cellWidth) + 1;
      const columnEnd = columnStart + 1;
      const rowStart = Math.floor(newTop / cellHeight) + 1;
      const rowEnd = rowStart + 1;
  
      // set the child div's position to the nearest grid cell
      childRef.current.style.gridRowStart = rowStart;
      childRef.current.style.gridColumnStart = columnStart;
      childRef.current.style.gridRowEnd = rowEnd;
      childRef.current.style.gridColumnEnd = columnEnd;
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
 
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
    setFloorLength(parseInt(e.target.value / 2) + 11)
    setFloorLengthStart(11 - parseInt(e.target.value / 2))
    setInnerLength(e.target.value)
  }
  function getDepth(e) {
    let currentValue = divideLength(e.target.value, 1, 3)
    setKitchenDepth(e.target.value)
    setFloorDepth(parseInt(e.target.value / 2) + 11)
    setFloorDepthStart(11 - parseInt(e.target.value / 2))
    setInnerDepth(e.target.value)
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
      meshRef.current.rotation.y = meshBedRotate;
      meshRef.current.position.y = 1;
      meshRef.current.position.x = -kitchenLength/2 + meshBedX + bedX
      meshRef.current.position.z = -kitchenDepth/2 + meshBedY + bedZ
      meshRef.current.receiveShadow = true;
      meshRef.current.castShadow = true;

    })
    return (
      <mesh ref={meshRef}>
        <boxGeometry args={[4, 2, 6]} />
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
         {/* gridColumnStart: props.floorLengthStart,
        gridColumnEnd: props.floorLength,
        gridRowStart: props.floorDepthStart,
        gridRowEnd: props.floorDepth */}
    <Canvas  shadows camera={{ position: [cam, 6, 15], fov: 75 }}>
      <OrbitControls/>
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

    
      <div className="menu-button" onClick={handleShow}></div>
      <div className="edit-container" style={slideIn}>
      <Map
        innerLength={innerLength}
        innerDepth={innerDepth}
        floorLengthStart={floorLengthStart}
        floorLength={floorLength}
        floorDepthStart={floorDepthStart}
        floorDepth={floorDepth}
        setBedX={setBedX}
        setBedZ={setBedZ}
          planColStart={planColStart}  
          planColEnd={planColEnd}
          planRowStart={planRowStart}
          planRowEnd={planRowEnd}
          newCol={newCol}
          newRow={newRow}
          background={bedImage}
      />
        <div style={{backgroundImage:`url('https://cdn3.iconfinder.com/data/icons/virtual-notebook/16/button_rotate-512.png')`, backgroundSize: "cover", width: '50px', height: '50px', zIndex: "5"}} onClick={rotateBed}>Rotate Bed</div>
        {/* <div className="map-wrap">
          <div className="floor-plan" style={{
              gridTemplateColumns: `repeat(${innerLength}, 1fr)`,
              gridTemplateRows: `repeat(${innerDepth}, 1fr)`,
              gridColumnStart: floorLengthStart,
              gridColumnEnd: floorLength,
              gridRowStart: floorDepthStart,
              gridRowEnd: floorDepth
          }}>
            <div>child</div>
        </div>
        </div> */}
      <div className="upper-wrap">
        Length: {kitchenLength} ft.
        <input id="length" step="2" type="range" min="10" max="20" defaultValue="6" onInput={getValue} />
        Depth: {kitchenDepth} ft.
        <input id="depth" step="2" type="range" min="10" max="20" defaultValue="6" onInput={getDepth} /> 
        </div>
      </div>
    </div>
  );
}


export default Bedroom;