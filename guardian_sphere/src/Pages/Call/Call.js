import React, { useState, useRef, useEffect } from "react";
import "./Call.css";
import Vapi from "@vapi-ai/web";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";


const apiKey = "2e5afc98-21a2-4665-96d5-c067a5e20b75";
//const assistantId = "a673aba3-7453-4adc-b10a-4fc6cbcd7310";

const vapi = new Vapi(apiKey);

const Call = () => {
    const [isCalling, setIsCalling] = useState(false);
    const [volume, setVolume] = useState(0);
    //const audioRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const { t } = useTranslation("Call");
    const navigate = useNavigate();

    
    // Initialisation de l'AudioContext
    useEffect(() => {
        try {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            analyserRef.current = audioContextRef.current.createAnalyser();
            analyserRef.current.fftSize = 256;
            console.log("AudioContext initialized successfully");
        } catch (error) {
            console.error("Error initializing AudioContext:", error);
        }

        return () => {
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);

    const startCall = () => {
        if (isCalling) {
            console.log("Call is already in progress.");
            return;
        }

        // Vérification du microphone
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then((stream) => {
                console.log("Microphone access granted");
                stream.getTracks().forEach(track => track.stop()); // On arrête le stream tout de suite
            })
            .catch((err) => {
                console.error("Microphone not found:", err);
                alert("No microphone detected. The call will still proceed, but without audio input.");
            });

        setIsCalling(true);
        console.log("Starting Vapi...");

        // vapi.start(assistantId);


        // vapi.on("error", (error) => {
        //     console.error("Vapi error:", error);
        // });


        // vapi.on("start", () => {
        //     console.log("Assistant started speaking");
        // });

   
        // vapi.on("end", () => {
        //     console.log("Assistant stopped speaking");
        //     setVolume(0);
        // });


        // vapi.on("speech", (audioData) => {
        //     console.log("Received speech data from assistant");
        //     try {
        //         const audioBlob = new Blob([audioData], { type: "audio/mpeg" });
        //         const audioUrl = URL.createObjectURL(audioBlob);
        //         const audioElement = new Audio(audioUrl);

        //         audioElement.oncanplaythrough = () => {
        //             console.log("Audio ready to play");
        //             const source = audioContextRef.current.createMediaElementSource(audioElement);
        //             source.connect(analyserRef.current);
        //             analyserRef.current.connect(audioContextRef.current.destination);

        //             const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
                    
        //             const updateVolume = () => {
        //                 analyserRef.current.getByteFrequencyData(dataArray);
        //                 const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
        //                 const normalizedVolume = average / 256;
        //                 console.log("Current volume:", normalizedVolume);
        //                 setVolume(normalizedVolume);
                        
        //                 if (isCalling) {
        //                     requestAnimationFrame(updateVolume);
        //                 }
        //             };
                    
        //             updateVolume();
        //             audioElement.play().catch(error => {
        //                 console.error("Error playing audio:", error);
        //             });
        //         };

        //         audioElement.onended = () => {
        //             console.log("Audio ended");
        //             URL.revokeObjectURL(audioUrl);
        //         };

        //     } catch (error) {
        //         console.error("Error processing audio:", error);
        //     }
        // });
    };

    const stopCall = () => {
        if (!isCalling) {
            console.log("No active call to stop.");
            return;
        }

        console.log("Stopping call...");
        setIsCalling(false);
        vapi.stop();
        setVolume(0);
    };

    return (
        <div className="call-container">
        <button onClick={() => navigate("/home")} className="home-back-button">{t("home")}</button>
            <h1 className="call-title">{t("assistantWelcome")}</h1>
            <p className="call-subtitle">{t("assistantInstruction")}</p>

            <div className="call-visualizer">
                <div
                    className="call-circle"
                    style={{
                        transform: `scale(${1 + volume * 2})`,
                        opacity: 0.6 + volume * 0.4,
                    }}
                ></div>
            </div>

            <div className="call-logo" onClick={isCalling ? stopCall : startCall}>
                <img
                    src={isCalling ? "/Pictures/end-call.png" : "/Pictures/start-call.png"}
                    alt={isCalling ? "Hang Up" : "Call"}
                />
            </div>
            
            {/* Debug info */}
            <div style={{ position: 'fixed', bottom: 10, left: 10, background: 'rgba(0,0,0,0.7)', padding: '10px', color: 'white', fontSize: '12px' }}>
            {t("current_volume")}: {volume.toFixed(2)}
            </div>
        </div>
    );
};

export default Call;