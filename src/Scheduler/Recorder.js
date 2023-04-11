import RECORD_STATUS from './Record_Status';
var react = require('react');
var useTimer = function useTimer() {
  var countRef = react.useRef(null);

  var _useState = react.useState(0),
      timer = _useState[0],
      setTimer = _useState[1];

  var handleStartTimer = function handleStartTimer() {
    countRef.current = setInterval(function () {
      setTimer(function (timer) {
        return timer + 1;
      });
    }, 1000);
  };

  var handlePauseTimer = function handlePauseTimer() {
    clearInterval(countRef.current);
  };

  var handleResumeTimer = function handleResumeTimer() {
    countRef.current = setInterval(function () {
      setTimer(function (timer) {
        return timer + 1;
      });
    }, 1000);
  };

  var handleResetTimer = function handleResetTimer() {
    clearInterval(countRef.current);
    setTimer(0);
  };

  return {
    timer: timer,
    handleStartTimer: handleStartTimer,
    handlePauseTimer: handlePauseTimer,
    handleResumeTimer: handleResumeTimer,
    handleResetTimer: handleResetTimer
  };
};

var mediaRecorder;
var localStream;
var useAudioRecorder = function useAudioRecorder() {
  var dataArray = react.useRef([]);

  var mediaRecording = function mediaRecording() {
        return mediaRecorder;
  };

  var _useState = react.useState(RECORD_STATUS.IDLE),
      status = _useState[0],
      setStatus = _useState[1];

  var _useState2 = react.useState(''),
      audioResult = _useState2[0],
      setAudioResult = _useState2[1];

  var _useState3 = react.useState(''),
      errorMessage = _useState3[0],
      setErrorMessage = _useState3[1];

  var _useTimer = useTimer(),
      timer = _useTimer.timer,
      handleStartTimer = _useTimer.handleStartTimer,
      handlePauseTimer = _useTimer.handlePauseTimer,
      handleResumeTimer = _useTimer.handleResumeTimer,
      handleResetTimer = _useTimer.handleResetTimer;

  var startRecording = function startRecording() {
    if (status === RECORD_STATUS.IDLE) {
      try {
        setErrorMessage('');
        navigator.mediaDevices.getUserMedia({
          audio: true
        }).then(function (mediaStreamObj) {
          localStream = mediaStreamObj;
          mediaRecorder = new MediaRecorder(mediaStreamObj);
          mediaRecorder.start();

          mediaRecorder.onstart = function () {
            handleStartTimer();
            setStatus(RECORD_STATUS.RECORDING);
          };

          mediaRecorder.ondataavailable = function (event) {
            dataArray.current.push(event.data);
          };
        })["catch"](function (error) {
          setErrorMessage(error === null || error === void 0 ? void 0 : error.message);
        });
      } catch (error) {
        setErrorMessage(error === null || error === void 0 ? void 0 : error.message);
      }
    } else {
      return;
    }
  };

  var resumeRecording = function resumeRecording() {
    if (status === RECORD_STATUS.PAUSED) {
      mediaRecorder.resume();

      mediaRecorder.onresume = function () {
        handleResumeTimer();
        setStatus(RECORD_STATUS.RECORDING);
      };
    } else {
      return;
    }
  };

  var pauseRecording = function pauseRecording() {
    if (status === RECORD_STATUS.RECORDING) {
      mediaRecorder.pause();

      mediaRecorder.onpause = function () {
        handlePauseTimer();
        setStatus(RECORD_STATUS.PAUSED);
      };
    } else {
      return;
    }
  };

  var stopRecording = function stopRecording() {
    if (status !== RECORD_STATUS.IDLE) {
      mediaRecorder.stop();

      mediaRecorder.onstop = function () {
        handleResetTimer();
        var audioData = new Blob(dataArray.current, {
          type: 'audio/wav;'
        });
        dataArray.current = [];
        setAudioResult(window.URL.createObjectURL(audioData));
        setStatus(RECORD_STATUS.IDLE);
        localStream.getAudioTracks().forEach(function (track) {
          track.stop();
        });
      };
    } else {
      return;
    }
  };

  return {
    startRecording: startRecording,
    stopRecording: stopRecording,
    pauseRecording: pauseRecording,
    resumeRecording: resumeRecording,
    mediaRecording: mediaRecording,
    status: status,
    audioResult: audioResult,
    errorMessage: errorMessage,
    timer: timer
  };
};

var ReactAudioRecorder = function ReactAudioRecorder(_ref) {
  var render = _ref.render;

  var _useAudioRecorder = useAudioRecorder(),
      startRecording = _useAudioRecorder.startRecording,
      stopRecording = _useAudioRecorder.stopRecording,
      pauseRecording = _useAudioRecorder.pauseRecording,
      resumeRecording = _useAudioRecorder.resumeRecording,
      status = _useAudioRecorder.status,
      audioResult = _useAudioRecorder.audioResult,
      errorMessage = _useAudioRecorder.errorMessage,
      timer = _useAudioRecorder.timer;

  return render({
    startRecording: startRecording,
    stopRecording: stopRecording,
    pauseRecording: pauseRecording,
    resumeRecording: resumeRecording,
    status: status,
    audioResult: audioResult,
    errorMessage: errorMessage,
    timer: timer
  });
};

export default useAudioRecorder;