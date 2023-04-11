import {React, useState} from "react";
import './styles/Product.css'
const Product= () => {
    return(
        <div className="Product">
            <div className="Tagline">
                <div className="Mockup">
                <img src={require('../images/Mockup.png')} className="Image_Main"></img>
                </div>
                <div className="Text">
                <img src={require('../images/Text.png')} className="Text_Main"></img>
                <span style={{width: "100%", height:"1.5em"}}></span>
                <div className="Text_Main_Form" style={{width:"fill-available", height: "auto"}}>
                <form style={{maxWidth:"100%", maxHeight: "100%", display: "inline-block"}} onSubmit={(e)=> {e.preventDefault();}}>
                <input type="email" className="Input" placeholder="johndoe@xyz.org"/><span>&nbsp;</span><span>&nbsp;</span>
                <button className="Submit_Button"><img src={require('../images/email.png')} style={{width: "70%", height:"70%", padding: "5%"}}></img></button>
                </form>

                </div>
                </div>
            </div>
        </div>
);
}
export default Product;
