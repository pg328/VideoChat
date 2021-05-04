import firebase from 'firebase/app';
import 'firebase/firestore';
import {Box, Stack} from 'grommet';
import React, {createRef, useEffect, useRef, useState} from 'react';
import {useParams} from 'react-router-dom';
import './App.css';
import ButtonBar from './ButtonBar';
import {LinkLayer} from './LinkLayer';
import ScreenSharingContext from './ScreenSharingContext';
import SelfVideo from './SelfVideo';
import {theme} from './theme';
import VideoElem from './VideoElem';

const videoStyle = ' transform: rotateY(180deg); -webkit-transform:rotateY(180deg); -moz-transform:rotateY(180deg); ';
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiid: 'AIzaSyACAdlUJqq_FYg5beq2FG_GLExWvmGRCAU',
    authDomain: 'philvidchat.firebaseapp.com',
    projectId: 'philvidchat',
    storageBucket: 'philvidchat.appspot.com',
    messagingSenderId: '564284935763',
    appId: '1:564284935763:web:6385d3814826d24f2540a6',
};
const App = () => {
    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
    let {id} = useParams();

    const firestore = firebase.firestore();
    const servers = {
        iceServers: [
            {
                urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
            },
        ],
        iceCandidatePoolSize: 10,
    };
    const [pc, setPC] = useState(new RTCPeerConnection(servers));

    const [sharedStream, setSharedStream] = useState(null);
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [videoSender, setVideoSender] = useState(null);
    const [audioSender, setAudioSender] = useState(null);
    const [isSharing, setIsSharing] = useState(false);

    const localVideo = useRef();
    const remoteVideo = useRef();
    const [link, setLink] = useState();
    const getInitialLocalStream = async () => {
        let stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
        setLocalStream(stream);
        setRemoteStream(new MediaStream());

        let camVideoTrack = stream.getVideoTracks()[0];
        let camAudioTrack = stream.getAudioTracks()[0];

        // Push tracks from local store
        setVideoSender(pc.addTrack(camVideoTrack, stream));
        setAudioSender(pc.addTrack(camAudioTrack, stream));
    };
    const getLocalStream = async () => {
        let stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
        // Push tracks from local store
        // Show stream in HTML video
        let vt = stream.getVideoTracks()[0];
        //setVideoSender((v) => v.replaceTrack(stream.getVideoTracks()[0]));
        videoSender.replaceTrack(stream.getVideoTracks()[0]);
        //audioSender.replaceTrack(localStream.getAudioTracks()[0]);
        console.info('Track settings:');
        console.info(JSON.stringify(vt.getSettings(), null, 2));
        console.info('Track constraints:');
        console.info(JSON.stringify(vt.getConstraints(), null, 2));
        let tracks = sharedStream.getTracks();

        tracks.forEach((track) => track.stop());
    };
    const getSharedStream = async (displayMediaOptions) => {
        let stream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
        setSharedStream(stream);

        //// Show stream in HTML video
        //setLocalStream(sharedStream);

        let vt = stream.getVideoTracks()[0];
        videoSender.replaceTrack(stream.getVideoTracks()[0]);
        console.info('Track settings:');
        console.info(JSON.stringify(vt.getSettings(), null, 2));
        console.info('Track constraints:');
        console.info(JSON.stringify(vt.getConstraints(), null, 2));
    };
    // Pull tracks from remote stream, add to video stream
    pc.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
            setRemoteStream((r) => {
                r.addTrack(track);
                return r;
            });
        });
    };
    useEffect(async () => {
        await getInitialLocalStream();
        id ? console.info('answering...') : console.info('calling...');
        id ? await answer() : await call();

        return () => {
            const callDoc = firestore.collection('calls').doc();
            const offerCandidates = callDoc.collection('offerCandidates');
            const answerCandidates = callDoc.collection('answerCandidates');
            offerCandidates.doc().delete();
            answerCandidates.doc().delete();
            callDoc.delete();
        };
    }, []);

    const call = async () => {
        // Reference Firestore collections for signaling
        const callDoc = firestore.collection('calls').doc('aquarium');
        const offerCandidates = callDoc.collection('offerCandidates');
        const answerCandidates = callDoc.collection('answerCandidates');

        // Listen for remote answer
        //setRemoveAnswerListener(() =>
        callDoc.onSnapshot((snapshot) => {
            const data = snapshot.data();
            if (data?.answer) {
                const answerDescription = new RTCSessionDescription(data.answer);
                pc.setRemoteDescription(answerDescription);
                console.info(`Answer: `);
                console.info(answerDescription.sdp.search(/relay/) === -1);
            }
        }),
            answerCandidates.onSnapshot((snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === 'added') {
                        const candidate = new RTCIceCandidate(change.doc.data());
                        pc.addIceCandidate(candidate);
                    }
                });
            }),
            (pc.onicecandidate = (event) => {
                event.candidate && offerCandidates.add(event.candidate.toJSON());
            });

        pc.oniceconnectionstatechange = async function (event) {
            if (
                pc.iceConnectionState === 'failed' ||
                pc.iceConnectionState === 'disconnected' ||
                pc.iceConnectionState === 'closed'
            ) {
                pc.onicecandidate = null;
                call();
            }
        };

        // Create offer
        const offerDescription = await pc.createOffer();
        await pc.setLocalDescription(offerDescription);
        console.info(`Offer: `);
        console.info(offerDescription.sdp.search(/relay/) === -1);

        const offer = {
            sdp: offerDescription.sdp,
            type: offerDescription.type,
        };
        await callDoc.set({offer});
    };

    const answer = async () => {
        const callId = 'aquarium';
        const callDoc = firestore.collection('calls').doc(callId);
        const offerCandidates = callDoc.collection('offerCandidates');
        const answerCandidates = callDoc.collection('answerCandidates');

        pc.onicecandidate = (event) => {
            event.candidate && answerCandidates.add(event.candidate.toJSON());
        };

        // Fetch data, then set the offer & answer
        const callData = (await callDoc.get()).data();

        const offerDescription = callData.offer;
        await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

        const answerDescription = await pc.createAnswer();
        await pc.setLocalDescription(answerDescription);

        const answer = {
            type: answerDescription.type,
            sdp: answerDescription.sdp,
        };

        await callDoc.update({answer});

        // Listen to offer candidates

        //callDoc.onSnapshot((snapshot) => {
        //    const data = snapshot.data();
        //    if (data?.offer !== offerDescription) {
        //        let answer = {};
        //        const offerDescription = callData.offer;
        //        pc.setRemoteDescription(new RTCSessionDescription(offerDescription))
        //            .then(() => {
        //                return pc.createAnswer();
        //            })
        //            .then((answerDescription) => {
        //                answer = {
        //                    type: answerDescription.type,
        //                    sdp: answerDescription.sdp,
        //                };
        //                pc.setLocalDescription(answerDescription);
        //                return answer;
        //            })
        //            .then((answer) => callDoc.update({answer}));
        //    }
        //});
        offerCandidates.onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    let data = change.doc.data();
                    pc.addIceCandidate(new RTCIceCandidate(data));
                }
            });
        });
    };

    return (
        <Box a11yTitle="Body" overflow="hidden" width="100vw" height="100vh" background="black">
            {!id && <LinkLayer link={link} />}
            <Box width="100vw" height="100vh">
                <Stack anchor="top-right" fill>
                    <Stack anchor="bottom" fill>
                        <Box width="100%" height="100%" justify="center">
                            <VideoElem
                                aria-label="Remote Stream"
                                autoPlay
                                playsInline
                                srcObject={remoteStream}
                                ref={remoteVideo}
                            ></VideoElem>
                        </Box>
                        <Box
                            className="hides"
                            round="medium"
                            background={theme.lightBackground}
                            overflow="hidden"
                            direction="row"
                            justify="around"
                        >
                            <ScreenSharingContext.Provider value={{isSharing, setIsSharing, remoteVideo}}>
                                <ButtonBar
                                    {...{
                                        remoteStream,
                                        localStream,
                                        sharedStream,
                                        getSharedStream,
                                        getLocalStream,
                                        pc,
                                    }}
                                />
                            </ScreenSharingContext.Provider>
                        </Box>
                    </Stack>
                    <Box width="small">
                        <SelfVideo
                            isFlipped
                            aria-label="Local Stream"
                            autoPlay
                            muted={true}
                            playsInline
                            srcObject={isSharing ? sharedStream : localStream}
                            ref={localVideo}
                        ></SelfVideo>
                    </Box>
                </Stack>
            </Box>
        </Box>
    );
};

export default App;
