import React, { Fragment, useState} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Calendar, Views, DateLocalizer, momentLocalizer} from 'react-big-calendar';
import events from './events';
import './react-big-calendar.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import "bootstrap/dist/css/bootstrap.min.css";
import './Scheduler.css'
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Voicenote from './Voicenote';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import overlap from 'react-big-calendar/lib/utils/layout-algorithms/overlap'
const Scheduler=({profile})=> {
    //Parameters Set by Database
    const break_hours = 1;
    const shift_hours = 8;
    const shift = 60*shift_hours; //Alter based on Need
    const [toastShow, setToastShow] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const [eventGroup, setEventGroup]=useState(null);
    const defaultDate = new Date();
    const localizer = momentLocalizer(moment);
    const [myEvents, setEvents] = useState(events);
    const [event, setCurrentEvent]=useState(null);
    const [undoableEvent, setUndoableEvent] = useState(null);
    const [showEvent, setShowEvent]=useState(false);
    const [showTab, setShowTab]=useState(false);
    const [showUndoable, setShowUndoable]=useState(false);
    //For Debugging

    const getActiveShift= (time) =>{
      for (var i=0; i<myEvents.length; i++) {
        if (myEvents[i].status !== '4' && myEvents[i].status !== '5' && moment(time).diff(myEvents[i].start, 'seconds') > 0 && moment(time).diff(myEvents[i].start, 'seconds') < (shift_hours*3600))
        {
            return myEvents[i];
        }
      }
      return null;
    }

    const getEvents= ({start, end}) => {
      var list=[]
      for (var i=0; i<myEvents.length; i++) {
        if (myEvents[i].status !== '4' && moment(myEvents[i].start).diff(start)>=0 && moment(myEvents[i].end).diff(end) <= 0)
        {
            list[list.length]= myEvents[i];
        }
        else if (myEvents[i].status === '4' && moment(start).diff(myEvents[i].end) < 0 && moment(end).diff(myEvents[i].end) >= 0) {
          list[list.length]= myEvents[i];
        }
        else if (myEvents[i].status === '4' && moment(end).diff(myEvents[i].start) > 0 && moment(start).diff(myEvents[i].start) <= 0) {
          list[list.length]= myEvents[i];
        }
      }
      return list;
    }
    const getCorrespondingBreaks = ({start, end}) => {
      var list=[]
      for (var i=0; i<myEvents.length; i++) {
        if (myEvents[i].status === '5' && moment(start).diff(myEvents[i].start, 'seconds') <= (break_hours*3600))
        {
            //alert(moment(start).diff(myEvents[i].start, 'seconds'));
            list[list.length]= myEvents[i];
        }
      }
      return list;
    }

    const setStatus= (status1) => {
       if (event == null) {
        return;
       }
       event.status=status1;
    }

    const getStatus = (event) => {
      var status;
      if (event == null) {
        status = '0';
      }
      else {
        status= event.status;
      }
      switch(status) {
        case '0' : return 'pending.png';
          break;
        case '1' : return 'tick.png';
          break;
        case '2' : return 'red_cross.png';
            break;
        case '3' : return 'swap.jpg';
            break;
        default : return '';
      }
    }


    function buildMessage(slotInfo) {
        return `[onSelectSlot] a date selection was made, passing 'slotInfo'
        ${JSON.stringify(slotInfo, null, 2)}`
    }
  
    const onSelectSlot = ({start, end, status1}) => {
        //const title = window.prompt('Enter Shift Description: ');
            //if (title) {
          if (status1 !== '5') {
            for (var i=0; i<myEvents.length; i++) {
                if (moment(myEvents[i].start).diff(moment(start)) === 0)
                {
                  //Add if to check for Undoable slot: If Undoable Delete and Proceed
                    return;
                }
                if (myEvents[i].status==='4' && moment(start).diff(moment(myEvents[i].start)) >=0 && moment(end).diff(moment(myEvents[i].end)) <=0)
                {
                  return;
                }
            }
          }
            if (moment.duration(moment(moment(end)).diff(moment(start))) > 0)
            {
                const title='No Case Assigned Yet.';
                //const id='3'; //Dynamic ID Generation Needed ************
                var id1 = '-1';
                if (status1 !== '4' && status1 !== '5'){
                  //alert("Here for Event");
                 id1 = ''+((start.getDay()*(24/shift_hours)) + (start.getHours()/shift_hours + 1));
                }
                const id = id1;
                const status=status1;
                const burnout='0';
                const designation='General'; //alter based on Profile
                const department='General' //alter based on Profile
                const swapReason='eg- Personal Conflict';
                setEvents((prev) => ([...prev, {id, title, start, end, status, burnout, swapReason, designation, department}]));
                if (status1 === '4') {
                  setToastMessage('Marked as Unavailable');
                  setToastShow(true);
                }
            }
            //}
        };

    return (
        <div className='Scheduler_Component' style={{height:"fit-content", width:"100%", fontFamily: "Lato"}}>
        <div style={{backgroundColor: "#ede8eb", height:"58vh", width:"100%", borderRadius:"20px", fontFamily: "Lato"}}>
            <Calendar
                    defaultDate={defaultDate}
                    defaultView={Views.DAY}
                    views={['week', 'day']}
                    events={myEvents}
                    localizer={localizer}
                    min={moment().startOf('day').toDate()}
                    max={moment().endOf('day').toDate()}
                    step={shift}
                    timeslots={1}
                    dayLayoutAlgorithm={(params) => {
                      return overlap({ ...params, minimumStartDifference: 15 })
                    }}
                    selectable
                    formats={{dayFormat: (date, culture, localizer) => localizer.format(date, 'ddd', culture), dayHeaderFormat: (date, culture, localizer) => localizer.format(date, 'dddd, MMM Do', culture), timeGutterFormat: (date, culture, localizer) => localizer.format(date, 'HH:mm', culture)}}
                    onSelectEvent={(event) => {if (event.status !== '4' && event.status !== '5') {setCurrentEvent(event)} else if (event.status === '4'){setUndoableEvent(event); setShowUndoable(true)}}}
                    onDoubleClickEvent={(event) => {if (event.status !== '4' && event.status !== '5') {setShowEvent(true)}}}//Dont show modal if Status = -1 (Undoable)
                    onSelectSlot={(slotInfo)=>{
                        if (moment.duration(moment(slotInfo.end).diff(moment(slotInfo.start))).hours() <= shift_hours)
                        {
                            //setCurrentEvent(slotInfo);
                            onSelectSlot({start: slotInfo.start, end: slotInfo.end, status1: '1'});
                        }
                        else{
                          //Export all slots in the Difference to Agenda List, If no slots, mark undoable
                          const limits=({start: slotInfo.start, end: slotInfo.end});
                          const events=getEvents(limits);
                          //alert(JSON.stringify(events, null, 2));
                          if (events.length === 0) {
                            onSelectSlot({start: slotInfo.start, end: slotInfo.end, status1: '4'});
                            return;
                          }
                          else {
                            setEventGroup(events);
                            setShowTab(true);

                          }
                        }
                    }}
                    //onSelecting={(range) => {console.log(buildMessage(range, 'onSelecting'))}}
                    longPressThreshold={0}
                    eventPropGetter={(event) => {
                      var backgroundColor;
                      var borderTop;
                      var borderBottom = '2px solid white'
                      var status;
                      if (event == null) {
                        status='0';
                      }
                      else {
                        status = event.status;
                      }
                      switch(status) {
                        case '0' : backgroundColor = '#E9CAB3';
                        borderTop = '8px solid rgba(248, 173, 88, 0.9)';
                          break;
                        case '1' : backgroundColor = '#B0DBB2';
                        borderTop = '8px solid rgba(100, 224, 121, 1)';
                          break;
                        case '2' : backgroundColor = '#EBA8AA';
                        borderTop = '8px solid rgba(255, 59, 59, 0.8)';
                            break;
                        case '3' : backgroundColor = '#C0CCE8';
                        borderTop = '8px solid rgba(140, 188, 255, 1)';
                            break;
                        case '4' : backgroundColor = 'rgb(74, 24, 58)';
                            borderTop = '8px solid rgb(74, 24, 58)';
                                break;
                        case '5' : backgroundColor = '#FCAB55';
                            borderTop = '0px solid #FCAB55';
                                break;    
                        default : backgroundColor = 'rgba(248, 173, 88, 0.3)';
                        borderTop = '8px solid rgba(248, 173, 88, 0.9)';
                      }
                      return { style: {backgroundColor, borderTop, borderBottom} };                      
                    }} 
            />
        </div>
        <div className='modal'>
        <Modal show={showEvent} onHide={() => {setShowEvent(false);}} className='shift_modal' centered>
            <Modal.Header closeButton>
                <Modal.Title>Shift Status</Modal.Title>
                <div>&nbsp;&nbsp;<img src={require('../images/'+getStatus(event))} style={{height:"25px"}}></img></div>
                </Modal.Header>
                <Modal.Body>
                <Form style={{display: "flex", justifyContent:"center", flexDirection:"column", padding: "0px"}} onSubmit={(event) => event.preventDefault()}>
      <Form.Group as={Row} className="mb-3" controlId="formPlaintextCaseName" style={{alignItems:"center"}}>
        <Form.Label column sm="2">
         <b> Assigned: </b>
        </Form.Label>
        <Col sm="10">
          <Form.Control plaintext readOnly value={(event ==null)? "Default Case" : event.title}/>
        </Col>
      </Form.Group>
      { (getStatus(event)=== 'swap.jpg') && <>
              <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                <Form.Label column sm="4">
                <b>Swap Requirement: </b>
                </Form.Label>
                <Col sm="8">
                  <Form.Control plaintext readOnly value={(event == null? "" : event.designation)}/>
                </Col>
              </Form.Group>
              <Button variant="primary" className="swap" type="submit" style={{minWidth:"35%", alignSelf:"center"}}>
                          Accept Swap
              </Button>
              </>
        }
        { (getStatus(event)==='tick.png') && <>
              { (moment.duration(moment(event.start).diff(moment())).asHours() >= shift_hours*(24/shift_hours - 3)) && (<><Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                <Form.Label column sm="3.5">
                <b>Request Swap: </b>
                </Form.Label>
                <Col sm="8.5">
                  <Form.Control as="textarea" placeholder={(event == null? "" : event.swapReason)} required rows={1}/>
                </Col>
              </Form.Group>
              <Button variant="primary" className="swap" type="button" style={{width:"25%", alignSelf:"center"}} onClick={()=>{setStatus('3'); setShowEvent(false);}}>
                          Swap
              </Button>
              <br /></>) }
              <div style={{width: "100%", display:"flex", justifyContent:"center", paddingBottom:"10px"}}>
              <Voicenote props={event, profile}/>
              </div>
              </>
        }
        { (getStatus(event)==='red_cross.png') && <>
              <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                <Form.Label column sm="2">
                <b>Burnout: </b>
                </Form.Label>
                <Col sm="10">
                <Form.Control plaintext readOnly value="You need Rest!" style={{fontWeight:"bold", color: "#9e1100"}}/>
                </Col>
              </Form.Group>
              </>
        }
      </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="primary" onClick={() => {setShowEvent(false);
                    setEvents((prev) => {
                      const events1 = [...prev,]
                      const idx = events1.indexOf(event)
                      events1.splice(idx, 1);
                      //alert(buildMessage(events1));
                      setCurrentEvent(null);
                      return events1;
                    });
                }} className="delete" style={{width:"25%"}}>
                    Delete
                </Button>
                </Modal.Footer>
        </Modal>
        </div>
        <br />
        <div style={{display:"flex", justifyContent:"center", paddingLeft:"5%", paddingRight:"5%"}}>
        <Button variant="primary" className="process" style={{width:"30%"}}>
                    Process
                </Button>
        <Button className="suspend" style={{height: "50px", width:"30%", minWidth:"80px", marginLeft:"10%", borderColor:"rgb(74, 24, 58)", borderWidth:"2px"}} onClick={()=>{
          //alert(getActiveShift(moment()));
          const startNow = moment().toDate();
          const endNow = moment().add(break_hours, 'hours').toDate();
          //const teststartNow = moment().add(1, 'hours').toDate();
          //const testendNow = moment().add(2, 'hours').toDate();
          const eventNow = getActiveShift(startNow);
          if (eventNow == null) {
            setToastMessage('No Shift Active');
            setToastShow(true);
            //show Toast Saying No Shift Active
            return;
          }
          else {
            var list = getCorrespondingBreaks(startNow, endNow);
            //alert(list.length);
            if (list.length === 0){
            onSelectSlot({start: startNow, end: endNow, status1: '5'});
            setToastMessage('On Call Staff Contacted: Rest!');
            setToastShow(true);
            //Show Toast Saying Break Started
            //onSelectSlot({start: teststartNow, end: testendNow, status1: '5'});
            }
            else {
              setToastMessage('On Call Staff Already Active');
              setToastShow(true);
              //Show Toast Saying Active Break
            }
          }
        }}>
        </Button>
        </div>
        <Modal show={showTab} onHide={() => {setShowTab(false);}} className='quick_modal' centered size='sm'>
            <Modal.Header closeButton>
                <Modal.Title>Quick Actions</Modal.Title>
                <div>&nbsp;&nbsp;<img src={require('../images/edit.png')} style={{height:"25px"}}></img></div>
                </Modal.Header>
                <Modal.Body style={{padding:"10px", display:"flex", gap:"20px", justifyContent:"center"}}>
                <Button variant="primary" className="add" style={{width:"30%", maxWidth:"200px"}}> 
                    Add
                </Button>
                <Button variant="primary" className="remove" style={{width:"30%", maxWidth:"200px"}} onClick={()=> {
                    setEvents((prev) => {
                      const events1 = [...prev,]
                      for (var i=0; i<eventGroup.length; i++) {
                      const idx = events1.indexOf(eventGroup[i])
                      events1.splice(idx, 1);
                      }
                      //alert(buildMessage(events1));
                      setEventGroup([]);
                      setShowTab(false);
                      return events1;
                    });
                }}>
                    Clear
                </Button>
                </Modal.Body>
        </Modal>
        <Modal show={showUndoable} onHide={() => {setShowUndoable(false);}} className='quick_modal' centered size='sm'>
            <Modal.Header closeButton>
                <Modal.Title>Quick Actions</Modal.Title>
                <div>&nbsp;&nbsp;<img src={require('../images/edit.png')} style={{height:"25px"}}></img></div>
                </Modal.Header>
                <Modal.Body style={{padding:"10px", display:"flex", gap:"20px", justifyContent:"center"}}>
                <Button variant="primary" className="remove" style={{width:"30%", maxWidth:"200px"}} onClick={()=> {
                    setEvents((prev) => {
                      const events1 = [...prev,]
                      const idx = events1.indexOf(undoableEvent)
                      events1.splice(idx, 1);
                      setShowUndoable(false);
                      setUndoableEvent(null);
                      return events1;
                    });
                }}>
                    Clear
                </Button>
                </Modal.Body>
        </Modal>
        <ToastContainer position='middle-center' className='message-container'>
        <Toast onClose={() => setToastShow(false)} show={toastShow} delay={2000} autohide className="message" animation={true}>
          <Toast.Body className='message-body'><div>{toastMessage}</div></Toast.Body>
        </Toast>
        </ToastContainer>
        </div>
        //Add onclick for new Event in that range 
    );
}
export default Scheduler;