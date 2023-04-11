import {React, useState} from "react";
import './styles/About.css'
import styled from "styled-components";
const About= () => {

    const About_Us_Main =styled.nav`
    margin: 0px;
    margin-bottom: 0px;
    padding-top: 0%;
    padding-bottom: 0%;
    width: 100%;
    min-width: 391px;
    display: flex;
    flex-direction: row;
    vertical-align: middle;
    @media (max-width: 1032px) {
       flex-direction: column;
    }
    `

    return(
        <About_Us_Main id="Anchor_About">
            <div className="Inner_Section">
            <img src={require('../images/roster_team.JPG')} className="Background" ></img>
            </div>
            <div className="Spacing" />
            <div className="Overlay">
            <img src={require('../images/Company_Name.png')} style={{maxWidth:"70%"}} className="Name"/>
            <div className="Wrapper">
                <div className="Company_Card"><label>Abhishek Pillai&nbsp;&nbsp;<label className="bar">&#x2022; &nbsp;</label>Ansh Bhatti&nbsp;&nbsp;<label className="bar">&#x2022; &nbsp;</label>Khushi Gupta</label>
                </div>
            </div>
            </div>
        </About_Us_Main>
);
}
export default About;
