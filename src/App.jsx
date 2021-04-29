import firebase from 'firebase/app';
import 'firebase/firestore';
import {Box, Stack} from 'grommet';
import React, {useEffect, useRef} from 'react';
import {useParams} from 'react-router-dom';
import './App.css';
import {LinkLayer} from './LinkLayer';
import {MuteButton} from './MuteButton';
import {ToggleVideoButton} from './ToggleVideoButton';
import {SelfVideo} from './SelfVideo';

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
    const pc = new RTCPeerConnection(servers);

    let localStream = null;
    let remoteStream = null;

    const localVideo = useRef();
    const remoteVideo = useRef();
    const textRef = useRef();

    const getLocalStream = async () => {
        localStream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
        remoteStream = new MediaStream();

        // Push tracks from local stream to peer connection
        localStream.getTracks().forEach((track) => {
            pc.addTrack(track, localStream);
        });

        // Show stream in HTML video
        localVideo.current.srcObject = localStream;
        remoteVideo.current.srcObject = remoteStream;
    };
    // Pull tracks from remote stream, add to video stream
    pc.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
            remoteStream.addTrack(track);
            //console.log(remoteStream);
        });
    };
    useEffect(async () => {
        await getLocalStream();
        id ? await answer() : await call();

        return () => {
            const callDoc = firestore.collection('calls').doc();
            const offerCandidates = callDoc.collection('offerCandidates');
            const answerCandidates = callDoc.collection('answerCandidates');
            offerCandidates.doc().delete();
            answerCandidates.doc().delete();
            callDoc.delete();
        };
    });

    const call = async () => {
        // Reference Firestore collections for signaling
        const callDoc = firestore.collection('calls').doc();
        const offerCandidates = callDoc.collection('offerCandidates');
        const answerCandidates = callDoc.collection('answerCandidates');

        // Listen for remote answer
        let removeAnswerListener = callDoc.onSnapshot((snapshot) => {
            const data = snapshot.data();
            if (data?.answer) {
                const answerDescription = new RTCSessionDescription(data.answer);
                if (pc.currentRemoteDescription) {
                    setTimeout(() => {}, 10000);
                }
                pc.setRemoteDescription(answerDescription);
                console.log(`Answer: `);
                console.log(answerDescription.sdp.search(/relay/) === -1);
            }
        });

        // Listen for remote ICE candidates
        let removeAnswerCandidateListener = answerCandidates.onSnapshot((snapshot) => {
            //console.log('New Answer Candidate Snapshot!');
            //console.log(snapshot.docChanges());
            snapshot.docChanges().forEach((change) => {
                //console.log('Change has happened...');
                if (change.type === 'added') {
                    //console.log('The change was an addition!');
                    const candidate = new RTCIceCandidate(change.doc.data());
                    pc.addIceCandidate(candidate);
                    //console.log('Answered!');
                }
            });
        });

        // callInput is a DOM input text box
        textRef.current = callDoc.id;

        //console.log(`Code: ${textRef.current}`);
        //console.log('1. Creating ICE candidate listener');
        // Get candidates for caller, save to db
        pc.onicecandidate = (event) => {
            //console.log('4. New (Offer) ICE Candidate Event'); //missing
            //console.log(event);
            event.candidate && offerCandidates.add(event.candidate.toJSON());
        };
        //console.log('2. Created!');

        pc.oniceconnectionstatechange = async function (event) {
            if (
                pc.iceConnectionState === 'failed' ||
                pc.iceConnectionState === 'disconnected' ||
                pc.iceConnectionState === 'closed'
            ) {
                pc.onicecandidate = null;
                textRef.current = null;
                //await callDoc.set({offer: null});
                call();
            }
        };

        // Create offer
        //console.log('3. Offer Creation');
        const offerDescription = await pc.createOffer();
        await pc.setLocalDescription(offerDescription);
        console.log(`Offer: `);
        console.log(offerDescription.sdp.search(/relay/) === -1);

        const offer = {
            sdp: offerDescription.sdp,
            type: offerDescription.type,
        };
        await callDoc.set({offer});
        //console.log('5. Set the offer');
    };

    const answer = async () => {
        const callId = id;
        const callDoc = firestore.collection('calls').doc(callId);
        const offerCandidates = callDoc.collection('offerCandidates');
        const answerCandidates = callDoc.collection('answerCandidates');

        //console.log('1. Creating ICE candidate listener');
        pc.onicecandidate = (event) => {
            //console.log('4/5. New (Answer) ICE Candidate Event');
            //console.log(event);
            event.candidate && answerCandidates.add(event.candidate.toJSON());
        };
        //console.log('2. Created!');

        // Fetch data, then set the offer & answer
        const callData = (await callDoc.get()).data();

        const offerDescription = callData.offer;
        //if (callData.offer) {
        //console.log('3. Offer Description');
        await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));
        console.log(offerDescription);

        //console.log('4. Answer Description');
        const answerDescription = await pc.createAnswer();
        await pc.setLocalDescription(answerDescription);

        const answer = {
            type: answerDescription.type,
            sdp: answerDescription.sdp,
        };

        await callDoc.update({answer});
        //}
        //console.log('6. Answer Updated!');

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
            //console.log('New Offer Candidate Snapshot');
            //console.log(snapshot.docChanges());
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    let data = change.doc.data();
                    pc.addIceCandidate(new RTCIceCandidate(data));
                    //console.log('ICE candidate Added!');
                }
            });
        });
    };

    return (
        <Box a11yTitle="Body" width="100vw" height="100vh" background="black">
            {!id && <LinkLayer tr={textRef} />}
            <Box width="100vw" height="100vh">
                <Stack anchor="top-right" fill>
                    <Stack anchor="bottom" fill>
                        <Box width="100%" height="100%" justify="center">
                            <video aria-label="Remote Stream" autoPlay playsInline ref={remoteVideo}></video>
                        </Box>
                        <Box direction="row" justify="around">
                            <MuteButton remoteVideoRef={localVideo} />
                            <ToggleVideoButton remoteVideoRef={localVideo} />
                        </Box>
                    </Stack>
                    <Box width="small">
                        <SelfVideo
                            aria-label="Local Stream"
                            autoPlay
                            muted={true}
                            playsInline
                            ref={localVideo}
                        ></SelfVideo>
                    </Box>
                </Stack>
            </Box>
        </Box>
    );
};

export default App;
