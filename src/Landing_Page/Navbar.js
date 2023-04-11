import {React, useState} from "react";
import './styles/Navbar_style.css'
import { Link } from "react-router-dom";
import { HashLink} from 'react-router-hash-link';
import styled from "styled-components";
import Log_Modal from "./Actions/Log_Modal";
import Sign_Modal from "./Actions/Sign_Modal";
const Navbar= () => {
    const [extend, setExtend] = useState(false);

    const [modal1Show, setModal1Show] = useState(false);
    const [modal2Show, setModal2Show] = useState(false);


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
    background-color: ${(props) => (props.extend ? "rgba(64, 12, 47, 1)": "rgba(64, 12, 47, 0.95)")};
    overflow: hidden;
    display: flex;
    flex-direction: column;
    position: sticky;
    top: 0;
    z-index: 1;

    @media (min-width: 1032px) {
        height: 111px;
    }
    `
    return(
    <Navbar_Main extend={extend}>
        <div className="Navbar_Inner_Container">
            <div className="Navbar_Left_Container">
                <Link to={"/home"}><img src={require('../images/Company_Name.png')} className="Logo" onClick={() => {window.scrollTo(0,0);}}></img></Link>
            </div>
            <div className="Navbar_Right_Container">
                <div className="Navbar_Link_Container">
                    <div className="OpenMenuButton" onClick={() =>{
                        setExtend((curr) => !curr);
                    }}> {extend ? <>&#10005;</> : <>&#8801;</>}</div>
                    <Link className="Element" onClick={() => {setModal2Show(false); setModal1Show(true);}}>FOR INSTITUTIONS</Link>
                    <Link className="Element" onClick={() => {setModal1Show(false); setModal2Show(true);}}>FOR MEDICAL STAFF</Link>
                    <HashLink to={"/home/#Anchor_About"} className="Element" onClick={() => {setExtend(false);}}>ABOUT</HashLink>
                    <Link onClick={() => {window.location = 'mailto:abhishekpillai94@gmail.com';}} className="Element">CONTACT</Link>
                </div>
            </div>
        </div>
        <hr style={{width: '90%', height: '2px', marginBottom:'0px', backgroundColor:'#FCA652', alignSelf:"center"}}></hr>
        { extend && (<div className="Navbar_Extended_Container" id="extended_navbar">
                    <Link className="Extended_Element" onClick={() => {setModal2Show(false); setModal1Show(true);}}>FOR INSTITUTIONS</Link>
                    <Link className="Extended_Element" onClick={() => {setModal1Show(false); setModal2Show(true);}}>FOR MEDICAL STAFF</Link>
                    <HashLink to={"/home/#Anchor_About"} className="Extended_Element" onClick={() => {setExtend(false);}}>ABOUT</HashLink>
                    <Link onClick={() => {window.location = 'mailto:abhishekpillai94@gmail.com';}} className="Extended_Element">CONTACT</Link>
            </div>)}
        <Log_Modal show={modal1Show} onHide={() => setModal1Show(false)}/>
        <Sign_Modal show={modal2Show} onHide={() => setModal2Show(false)}/>
    </Navbar_Main>
);
}
export default Navbar
