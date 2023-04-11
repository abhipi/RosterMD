import Dashboard_Navbar from "./Dashboard_Navbar";
import Scheduler from "./Scheduler";
import './Dashboard.css';
import { useEffect } from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
const Dashboard=({profile})=> {
    return(
        <div className="dashboard">
            <Dashboard_Navbar />
            <div className="operations">
            <div className="scheduling">
            <div className="drop_down_provider">
            <Dropdown autoClose="outside" align="start">
                <Dropdown.Toggle>
                <img src={require('../images/cross_logo.png')} style={{height:"30px", borderRadius:"30px"}} />Emory University Hospital Midtown
                </Dropdown.Toggle>

                <Dropdown.Menu>
                <Dropdown.Item href="#"><img src={require('../images/cross_logo.png')} style={{height:"30px", borderRadius:"30px"}} />Grady Memorial Hospital</Dropdown.Item>
                <Dropdown.Item href="#"><img src={require('../images/cross_logo.png')} style={{height:"30px", borderRadius:"30px"}} />Select Speciality Hospital- Midtown</Dropdown.Item>
                <Dropdown.Item href="#"><img src={require('../images/cross_logo.png')} style={{height:"30px", borderRadius:"30px"}} />Piedmont Atlanta Hospital</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            </div>
            <div className="scheduler_container">
            <Scheduler props={profile}/>
            </div>
            </div>
            <div className="actions">
            </div>
            </div>
        </div>

    );
}
export default Dashboard;