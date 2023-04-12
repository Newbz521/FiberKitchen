import logo from './logo.svg';
import './App.css';
import KitchenScene from './KitchenComponent/Kitchen';
import Bedroom from './BedroomComponent/Bedroom';
import { Routes, Route, useParams } from "react-router-dom";
import { Link } from "react-router-dom";


function App() {
  return (
    <div className="App">
       <Routes>
        <Route path="/kitchen" element={<KitchenScene />}></Route>
        <Route path="/bedroom" element={<Bedroom/>}></Route>
      </Routes>
      <nav className='page-select-container'>
        <Link className="page-select" to="/kitchen">Kitchen</Link>
        <Link className="page-select" to="/bedroom">Bedroom</Link>
      </nav>
    </div>
  );
}

export default App;
