import { useState, useRef } from 'react';
import "./bedroom.css"

function Map(props) {
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

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
      const columnStart = Math.floor(newLeft / cellWidth) ;
      const columnEnd = columnStart + 4;
      const rowStart = Math.floor(newTop / cellHeight) ;
      const rowEnd = rowStart + 6;
  
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
 
  return (
    <>
    <div className="map-wrap">
    <div
      ref={parentRef}
      className="grid"
      onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          
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
            style={{
              position: "relative",
              width: `${100} %`,
              height: `${100} %`,
              gridRowStart:1,
              gridRowEnd: 7,
              gridColumnStart: 1,
              gridColumnEnd: 5,
            }}
          >
        DRAG ME
      
      </div>
      </div>
      </div>
     
      </>
  );
}

export default Map;

