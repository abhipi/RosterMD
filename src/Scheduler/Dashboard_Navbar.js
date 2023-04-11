import {React, useState} from "react";
import '../Landing_Page/styles/Navbar_style.css'
import { Link } from "react-router-dom";
import { HashLink} from 'react-router-hash-link';
import styled from "styled-components";
import Profile_Modal from "./Profile_Modal";
const Dashboard_Navbar= ({profile}) => {
    const [extend, setExtend] = useState(false);
    const [profileShow, setProfileShow] = useState(false);
    window.onresize = function() {
        if (extend && window.innerWidth >= 1032)
        {
            setExtend(false);
        }
    };

    const Navbar_Main =styled.nav`
    min-width: 391px;
    width: 100%;
    height: ${(props) => (props.extend ? `${window.innerHeight}px`: "111px")};
    background-color: ${(props) => (props.extend ? "rgba(64, 12, 47, 1)": "rgba(64, 12, 47, 1)")};
    overflow: hidden;
    display: flex;
    flex-direction: column;
    position: sticky;
    top: 0;
    z-index: 2000;

    @media (min-width: 1032px) {
        height: 111px;
    }
    `
    return(
    <Navbar_Main extend={extend}>
        <div className="Navbar_Inner_Container">
            <div className="Navbar_Left_Container">
                <Link to={"/home"}><img src={require('../images/Company_Name.png')} className="Logo"></img></Link>
            </div>
            <div className="Navbar_Right_Container">
                <div className="Navbar_Link_Container">
                    <div className="OpenMenuButton" onClick={() =>{
                        setExtend((curr) => !curr);
                    }}> {extend ? <>&#10005;</> : <>&#8801;</>}</div>
                    <Link className="Element"><img src={require('../images/roster.png')} style={{height:"30px", borderRadius:"30px"}}></img>&nbsp;&nbsp;ROSTER REVIEW</Link>
                    <Link className="Element" onClick={()=>{setProfileShow(true)}}><img src={require('../images/doctor.jpg')} style={{height:"30px", borderRadius:"30px"}}></img>&nbsp;&nbsp;PROFILE</Link>
                    <Link className="Element">AGENDA</Link>
                    <Link className="Element">LOG OUT</Link>
                </div>
            </div>
        </div>
        <hr style={{width: '90%', height: '2px', marginBottom:'0px', backgroundColor:'#FCA652', alignSelf:"center"}}></hr>
        { extend && (<div className="Navbar_Extended_Container" id="extended_navbar">
                    <Link className="Extended_Element"><img src={require('../images/roster.png')} style={{height:"30px", borderRadius:"30px"}}></img>&nbsp;&nbsp;ROSTER REVIEW</Link>
                    <Link className="Extended_Element" onClick={()=>{setProfileShow(true); setExtend(false);}}><img src={require('../images/doctor.jpg')} style={{height:"30px", borderRadius:"30px"}}></img>&nbsp;&nbsp;PROFILE</Link>
                    <Link className="Extended_Element">AGENDA</Link>
                    <Link className="Extended_Element">LOG OUT</Link>
            </div>)}
        <Profile_Modal show={profileShow} onHide={() => setProfileShow(false)}/>
    </Navbar_Main>
); 
}
export default Dashboard_Navbar
