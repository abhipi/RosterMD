import {React, useEffect} from 'react'
import useAudioRecorder from './Recorder'
import RECORD_STATUS from './Record_Status'
import './Voicenote.css'
import getBlobDuration from 'get-blob-duration'
import AudioAnalyser from './AudioAnalyser'
const Voicenote = ({event, profile}) => {
  const {
    audioResult,
    timer,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    mediaRecording,
    status,
    errorMessage,
  } = useAudioRecorder()

  const mediaRecorder = mediaRecording();

  useEffect(()=>{
    if (audioResult != null && audioResult.length > 0) {
    getBlobDuration(audioResult).then((value) => {
     console.log(value); 
    // console.log(mediaRecorder)
      //Save to Backend
      //Check for Duration, Content Requirements
    }
    );
    }
  },[audioResult]);

  useEffect(() => {
    if (mediaRecorder == null) {
     // console.log("Yes");
    }
    else {
     // console.log(mediaRecorder);
    }
  }, [mediaRecorder]);

  return (
      <div className='inner-container'>
         {audioResult && (<audio controls={true} autoPlay={false} width="100%" preload="none" muted={false}><source src={audioResult} type="audio/mpeg"></source></audio>)}
        <div style={{display: "flex", gap: "20px"}}>
          <div style={{display:"flex", justifyContent:"center"}}>
         <p
          className={`timer ${
            status === RECORD_STATUS.PAUSED ? 'blink-animation' : ''
          }`}
          style={{marginTop: "20px"}}
        >
          {new Date(timer * 1000).toISOString().substr(11, 8)}
        </p>
        </div>
        <div>
        {status===RECORD_STATUS.RECORDING ? <AudioAnalyser audio={mediaRecorder.stream} /> : ''}
        </div>
        </div>
        <p className='status'>{(status === RECORD_STATUS.RECORDING? (<><img src={require('../images/recording_now.png')} style={{width:"15px", height:"15px", borderRadius:"20px"}}></img> Recording</>): status)}</p>
        <p className='error'>{errorMessage}</p>
        <div className='buttons'>
          <button
            className='btn-play'
            type='button'
            onClick={
              status === RECORD_STATUS.RECORDING
                ? pauseRecording
                : resumeRecording
            }
          >
            <i
              className={`fas fa-${
                status === RECORD_STATUS.RECORDING ? 'pause' : 'play'
              }`}
            ></i>
          </button>
          <button className='btn-record' type='button' onClick={startRecording}>
            <i className={'fas fa-microphone'}></i>
          </button>
          <button className='btn-stop' type='button' onClick={stopRecording}>
            <i className={'fas fa-stop'}></i>
          </button>
        </div>
      </div>
  )
}

export default Voicenote;
