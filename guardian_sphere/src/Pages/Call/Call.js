import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import "./Call.css";
import { useNavigate } from "react-router-dom";
import Vapi from "@vapi-ai/web";

const vapi = new Vapi("VOTRE_CLÉ_API_PUBLIC");

const Call = () => {
    const { t } = useTranslation("Call");
    const username = localStorage.getItem("username") || t("defaultUser");
    const [messages, setMessages] = useState([]);
    const [isCalling, setIsCalling] = useState(false);
    const [volume, setVolume] = useState(0); // Pour gérer le niveau sonore
    const audioRef = useRef(null); // Référence pour l'API AudioContext


    const startCall = () => {
        setIsCalling(true);

        // Initialisation de Vapi
        vapi.start({
            transcriber: {
                provider: "deepgram",
                model: "nova-2",
                language: "fr-FR",
            },
            model: {
                provider: "openai",
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "Vous êtes un assistant utile et attentif.",
                    },
                ],
            },
            voice: {
                provider: "playht",
                voiceId: "fr-FR-Standard-A",
            },
        });

        // Analyser le volume sonore
        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const analyser = audioContext.createAnalyser();
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);
            analyser.fftSize = 256;

            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            const checkVolume = () => {
                analyser.getByteFrequencyData(dataArray);
                const maxVolume = Math.max(...dataArray);
                setVolume(maxVolume / 256); // Normaliser le volume
                if (isCalling) requestAnimationFrame(checkVolume);
            };

            checkVolume();
            audioRef.current = { audioContext, stream };
        });
    };

    const stopCall = () => {
        setIsCalling(false);
        vapi.stop();

        // Arrêter l'analyse audio
        if (audioRef.current) {
            const { audioContext, stream } = audioRef.current;
            stream.getTracks().forEach((track) => track.stop());
            audioContext.close();
            audioRef.current = null;
        }
    };

    return (
        <div className="call-container">
            <h1 className="call-title">{t("assistantWelcome")}</h1>
            <p className="call-subtitle">{t("assistantInstruction")}</p>
    
            {/* Cercle dynamique qui bouge toujours */}
            <div className="call-visualizer">
                <div
                    className="call-circle"
                    style={{
                        transform: `scale(${1 + volume})`, // Ajuste la taille en fonction du volume sonore
                    }}
                ></div>
            </div>
            {/* Icônes interactives pour appeler et raccrocher */}
            <div className="call-logo" onClick={isCalling ? stopCall : startCall}>
                <img
                    src={
                        isCalling
                            ? "/Pictures/end-call.png" // Icône pour raccrocher
                            : "/Pictures/start-call.png" // Icône pour appeler
                    }
                    alt={isCalling ? "Hang Up" : "Call"}
                />
            </div>
        </div>
    );     
};

export default Call;
