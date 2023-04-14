import { useState, useRef , useEffect} from 'react';
import "./bedroom.css"

function Map(props) {
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [boxes,setBoxes] = useState([])

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
      let newLeft, newTop;
      if (event.type === "touchmove") {
        newLeft = event.touches[0].clientX - parentRect.left;
        newTop = event.touches[0].clientY - parentRect.top;
      } else {
        newLeft = event.clientX - parentRect.left;
        newTop = event.clientY - parentRect.top;
      }
      // calculate the nearest grid cell based on the current mouse position
      const cellWidth = parentRect.width / props.innerLength;
      const cellHeight = parentRect.height / props.innerDepth;
      // const newLeft = Math.floor((event.clientX - parentRect.left) / cellWidth) * cellWidth;
      // const newTop = Math.floor((event.clientY - parentRect.top) / cellHeight) * cellHeight;
  
      // calculate the grid start and end positions for the child div based on the nearest grid cell
      const columnStart = Math.floor(newLeft / cellWidth) ;
      const columnEnd = columnStart + props.newCol;
      const rowStart = Math.floor(newTop / cellHeight) ;
      const rowEnd = rowStart + props.newRow;
  
      // set the child div's position to the nearest grid cell
      childRef.current.style.gridRowStart = rowStart;
      childRef.current.style.gridColumnStart = columnStart;
      childRef.current.style.gridRowEnd = rowEnd;
      childRef.current.style.gridColumnEnd = columnEnd;
      
      props.setBedX(columnStart - 1);
      props.setBedZ(rowStart - 1);
    }
  };
  
  
  

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (event) => {
    setIsDragging(true);

    // prevent scrolling on touch devices
    event.preventDefault();
  };
  const handleTouchEnd = () => {
    setIsDragging(false);
  };
  
  let gridLines = [];
  useEffect(() => {
    gridLines = []
    for (let i = 0; i < 20; i++){
      for (let j = 0; j < 20; j++){
  
        gridLines.push(j)
      }
    }
    gridLines.length = 400 - (props.innerLength * props.innerDepth)
    setBoxes(gridLines)

  },[props.innerLength, props.innerDepth])
  // let gridLines = new Array()
  // gridLines = []
  // for (let i = 0; i < 20; i++){
  //   for (let j = 0; j < 20; j++){

  //     gridLines.push(j)
  //   }
  // }
  

  return (
    <>
      <div className="map-wrap">
        {boxes.map((index) => (<div style={{
          // position: "fixed",
          border: ".5px solid lightgrey",
          // gridColumnStart: index + 1,
          // gridColumnEnd: index + 2,
          // gridRowStart: index + 1,
          // gridRowEnd: index + 2,
          // zIndex: "15"
        }}></div>))}
    <div
      ref={parentRef}
      className="grid"
          onMouseMove={handleMouseMove}
          onTouchMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchEnd={handleTouchEnd}
      style={{
        gridTemplateColumns: `repeat(${props.innerLength}, 1fr)`,
        gridTemplateRows: `repeat(${props.innerDepth}, 1fr)`,
        gridColumnStart: props.floorLengthStart,
        gridColumnEnd: props.floorLength,
        gridRowStart: props.floorDepthStart,
        gridRowEnd: props.floorDepth
    }}
    >
      <div
        ref={childRef}
        className="child"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            style={{
              position: "relative",
              width: `${100} %`,
              height: `${100} %`,
              gridColumnStart: props.planColStart,
              gridColumnEnd: props.planColEnd,
              gridRowStart: props.planRowStart,
              gridRowEnd: props.planRowEnd,
              backgroundImage: `url(${props.background})`
            }}
          >
            {/* <div  style={{ height: "100%", width: "100%",backgroundImage: `url(${props.background})` }} ></div> */}
      
          </div>
          
      </div>
      </div>
     
      </>
  );
}

export default Map;

