import React, {useEffect, useRef, useState} from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
import {Box, Button, Layer, Stack, Text, TextInput, Video} from 'grommet';
import firebase from 'firebase/app';
import 'firebase/firestore';
import styled from 'styled-components';

const videoStyle = ' transform: rotateY(180deg); -webkit-transform:rotateY(180deg); -moz-transform:rotateY(180deg); ';
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyACAdlUJqq_FYg5beq2FG_GLExWvmGRCAU',
    authDomain: 'philvidchat.firebaseapp.com',
    projectId: 'philvidchat',
    storageBucket: 'philvidchat.appspot.com',
    messagingSenderId: '564284935763',
    appId: '1:564284935763:web:6385d3814826d24f2540a6',
};
const theme = {orange: '#E4572E', darkblue: '#29335C', yellow: '#F3A712', green: '#A8C686', lightblue: '#669BBC'};

const App = () => {
    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

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
    const key = window.location.href.split('/')[3];

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
            console.log(remoteStream);
        });
    };
    useEffect(async () => {
        await getLocalStream();
        key ? await answer() : await call();
    });

    const call = async () => {
        // Reference Firestore collections for signaling
        const callDoc = firestore.collection('calls').doc();
        const offerCandidates = callDoc.collection('offerCandidates');
        const answerCandidates = callDoc.collection('answerCandidates');

        // callInput is a DOM input text box
        textRef.current = callDoc.id;

        console.log(`Code: ${textRef.current}`);
        console.log('1. Creating ICE candidate listener');
        // Get candidates for caller, save to db
        pc.onicecandidate = (event) => {
            console.log('4. New (Offer) ICE Candidate Event'); //missing
            console.log(event);
            event.candidate && offerCandidates.add(event.candidate.toJSON());
        };
        console.log('2. Created!');

        // Create offer
        console.log('3. Offer Creation');
        const offerDescription = await pc.createOffer();
        await pc.setLocalDescription(offerDescription);

        const offer = {
            sdp: offerDescription.sdp,
            type: offerDescription.type,
        };
        await callDoc.set({offer});
        console.log('5. Set the offer');

        // Listen for remote answer
        callDoc.onSnapshot((snapshot) => {
            const data = snapshot.data();
            if (!pc.currentRemoteDescription && data?.answer) {
                const answerDescription = new RTCSessionDescription(data.answer);
                pc.setRemoteDescription(answerDescription);
                console.log('Data.Answer Updated!');
            }
        });

        // Listen for remote ICE candidates
        answerCandidates.onSnapshot((snapshot) => {
            console.log('New Answer Candidate Snapshot!');
            console.log(snapshot.docChanges());
            snapshot.docChanges().forEach((change) => {
                console.log('Change has happened...');
                if (change.type === 'added') {
                    console.log('The change was an addition!');
                    const candidate = new RTCIceCandidate(change.doc.data());
                    pc.addIceCandidate(candidate);
                    console.log('Answered!');
                }
            });
        });
    };

    const answer = async () => {
        const callId = key;
        const callDoc = firestore.collection('calls').doc(callId);
        const offerCandidates = callDoc.collection('offerCandidates');
        const answerCandidates = callDoc.collection('answerCandidates');

        console.log('1. Creating ICE candidate listener');
        pc.onicecandidate = (event) => {
            console.log('4/5. New (Answer) ICE Candidate Event');
            console.log(event);
            event.candidate && answerCandidates.add(event.candidate.toJSON());
        };
        console.log('2. Created!');

        // Fetch data, then set the offer & answer
        const callData = (await callDoc.get()).data();

        console.log('3. Offer Description');
        const offerDescription = callData.offer;
        await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

        console.log('4. Answer Description');
        const answerDescription = await pc.createAnswer();
        await pc.setLocalDescription(answerDescription);

        const answer = {
            type: answerDescription.type,
            sdp: answerDescription.sdp,
        };

        await callDoc.update({answer});
        console.log('6. Answer Updated!');

        // Listen to offer candidates

        offerCandidates.onSnapshot((snapshot) => {
            console.log('New Offer Candidate Snapshot');
            console.log(snapshot.docChanges());
            snapshot.docChanges().forEach((change) => {
                console.log('New doc Change');
                if (change.type === 'added') {
                    console.log('Change was an addition');
                    let data = change.doc.data();
                    pc.addIceCandidate(new RTCIceCandidate(data));
                    console.log('ICE candidate Added!');
                }
            });
        });
    };

    return (
        <Box a11yTitle="Body" fill>
            {!key && <LinkLayer tr={textRef} />}
            <Box>
                <Stack anchor="top-right">
                    <Box>
                        <video aria-label="Remote Stream" autoPlay playsInline ref={remoteVideo}></video>
                    </Box>
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

const SelfVideo = styled.video`
& {
	transform: rotateY(180deg);
	-webkit-transform:rotateY(180deg);
	-moz-transform:rotateY(180deg);}
`;
const LinkLayer = ({tr, ...props}) => {
    const [show, setShow] = useState(true);
    return (
        <Box>
            {show && (
                <Layer responsive position="center">
                    <Box background={theme.yellow} round="small">
                        <Box round="medium" width="large" direction="row" justify="center" align="center">
                            <Text>{`Psst, here's a lil link to send to ur pals 😏😏: `}</Text>
                        </Box>
                        <Box round="medium" width="large" direction="row" justify="center" align="center">
                            <Box elevation="medium" background={theme.green} round="medium">
                                <Button
                                    label={<Text weight={500}>{`(Click me to copy the link 😎)`}</Text>}
                                    plain
                                    onClick={() => {
                                        navigator.clipboard.writeText(window.location.href + tr.current);
                                        console.log(tr.current.length);
                                        setShow(false);
                                    }}
                                ></Button>
                            </Box>
                        </Box>
                    </Box>
                </Layer>
            )}
        </Box>
    );
};
