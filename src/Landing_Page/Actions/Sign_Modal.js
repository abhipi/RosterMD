import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import '../styles/Log_Modal.css'
import {
  MDBContainer,
  MDBInput,
  MDBCheckbox,
  MDBBtn,
  MDBIcon,
  MDBRow,
  MDBCol
}
from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';
const Sign_Modal = (props) => {
  
  const [invalid, setInvalid]=useState(false);

  function refreshPage() {
    window.location.reload(false);
  }

  return (
    <div className="outside">
    <Modal
      {...props}
      size="m"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      style={{fontFamily:"Lato", minWidth:"391px"}}
      animation={true}
    >
      <Modal.Header closeButton style={{backgroundColor: "rgba(64, 12, 47, 1)", color:"white", borderWidth:"2px", borderColor:"rgb(64, 12, 47)"}}>
        <Modal.Title id="contained-modal-title-vcenter">
          For Medical Staff&nbsp;&nbsp;<img src={require('../../images/mask.png')} style={{height:"30px"}}></img>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{backgroundColor:"rgba(64, 12, 47, 0.9)"}}>
      <form style={{textAlign:"center"}} onSubmit={(e)=> {e.preventDefault();}}>
      <MDBInput className='mb-4' type='text' id='form2Example1' style={{padding:"2%", borderRadius:"30px", textAlign:"center"}} placeholder="Provider Name" required minLength={6}/>
      <MDBInput className='mb-4' type='email' id='form2Example1' style={{padding:"2%", borderRadius:"30px", textAlign:"center"}} placeholder="Work Email" required/>
      <MDBInput className='mb-4' type='password' id='form2Example2' style={{padding:"2%", borderRadius:"30px", textAlign:"center"}} placeholder="Password" required minLength={6}/>
{invalid && (<p style={{color:"#FF7D7D"}}>Invalid Credentials</p>)}
      <MDBRow className='mb-4' style={{whiteSpace:"nowrap"}}>
        <MDBCol className='d-flex justify-content-center'>
          <MDBCheckbox id='form2Example3' label='Remember Me' defaultChecked/>
        </MDBCol>
        <MDBCol className='d-flex justify-content-center'>
        <MDBBtn className='mb-4' style={{height:"40px", maxWidth: "140px", width:"100%", paddingLeft:"10%", paddingRight:"10%", color:"white", backgroundColor:"rgb(64, 12, 47)"}} onClick={refreshPage}>
        Forgot?
      </MDBBtn>
        </MDBCol>
        <MDBCol className='d-flex justify-content-center'>
        <MDBBtn className='mb-4' style={{height:"40px", maxWidth: "140px", width:"100%", paddingLeft:"10%", paddingRight:"10%", color:"black",backgroundImage: "linear-gradient(135deg, #FBA854 0%, #FBA854 100%)", fontWeight:"590", fontSize:"115%"}}>
        Sign in!
      </MDBBtn>
        </MDBCol>
      </MDBRow>
      <div className='text-center' style={{color:"white", display:"block", paddingLeft:"5%", paddingRight:"5%", paddingTop:"3%", paddingBottom:"0.5%", borderRadius:"30px", backgroundColor:"rgb(64, 12, 47)"}}>
        <p>
          Not a member?&nbsp;&nbsp;&nbsp;&nbsp;<Link style={{color:"#FBC469", textDecoration:""}} onClick={refreshPage}>Register</Link>
        </p>
      </div>
    </form>        
      </Modal.Body>
    </Modal>
    </div>
  );
}
export default Sign_Modal;