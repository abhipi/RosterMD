import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import '../Landing_Page/styles/Log_Modal.css'
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
const Profile_Modal = (props) => {

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
      centered
      animation={true}
      style={{zIndex:"2000"}}
    >
      <Modal.Header closeButton style={{backgroundColor: "rgba(64, 12, 47, 1)", color:"white", borderWidth:"2px", borderColor:"rgb(64, 12, 47)"}}>
        <Modal.Title id="contained-modal-title-vcenter">
          Profile&nbsp;&nbsp;<img src={require('../images/doctor.jpg')} style={{height:"40px", borderRadius:"50px"}}></img>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{backgroundColor:"rgba(64, 12, 47, 0.9)", display:"flex", flexDirection:"row"}}>
      <div style={{flex:"50%", padding:"2%", display:"flex", flexDirection:"column", justifyContent: "center"}}>
      <div style={{marginTop:"5%", padding:"7%", display:"flex", textAlign:"center", color:"white", fontSize:"20px", borderRadius:"30px", backgroundColor:"#400C2F", justifyContent:"center", whiteSpace:"pre-line", flexDirection:"column"}}><img src={require('../images/profile.jpg')} style={{borderRadius:"20px", width:"100%"}}></img><div style={{marginTop:"5%", fontWeight:"300", fontSize:"25px"}}>John Doe</div><div style={{fontSize:"15px", fontWeight:"300"}}>He/Him</div><br /><Button style={{flex:"100%", backgroundColor:"rgba(255,255,255, 0.12)"}}>Profile</Button></div>
<br />
        </div><div style={{flex:"50%", padding:"2%", display:"flex", justifyContent:"center", flexDirection:"column"}}>
      <form style={{textAlign:"center"}} onSubmit={(e)=> {e.preventDefault();}}>
        <div style={{display:"flex", gap:"20px"}}>
        <div style={{display:"flex", flexDirection:"column", flex:"50%"}}><div style={{display:"flex", flexDirection:"column", justifyContent:"center"}}>
        <div style={{paddingBottom:"5%", color:"white", fontSize:"20px", fontWeight:"250"}}>Edit Details</div>
      <MDBInput className='mb-4' type='email' id='form2Example1' style={{padding:"2%", textAlign:"center", borderRadius:"30px"}} placeholder="Work Email" required/>
      <MDBInput className='mb-4' type='text' id='form2Example1' style={{padding:"2%", textAlign:"center", borderRadius:"30px"}} placeholder="Department" required/>
      <MDBInput className='mb-4' type='text' id='form2Example1' style={{padding:"2%", textAlign:"center", borderRadius:"30px"}} placeholder="Designation" required/>
      <MDBInput className='mb-4' type='text' id='form2Example1' style={{padding:"2%", textAlign:"center", borderRadius:"30px"}} placeholder="Weekly Hours" required/>
      <MDBInput className='mb-4' type='text' id='form2Example1' style={{padding:"2%", textAlign:"center", borderRadius:"30px"}} placeholder="Night Shifts" required/>
      <div><Button style={{backgroundColor:"rgb(249, 174, 88)", color:"black", width:"65%"}}>Save</Button></div>
       </div>
       </div>
       {invalid && (<p style={{color:"#FF7D7D"}}>Invalid Credentials</p>)}
       </div>
    </form>   
    </div>
      </Modal.Body>
    </Modal>
    </div>
  );
}
export default Profile_Modal;