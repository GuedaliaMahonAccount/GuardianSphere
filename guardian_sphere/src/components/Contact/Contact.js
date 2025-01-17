import React, { useState, useEffect } from "react";
// import { useTranslation } from "react-i18next";
import { incrementContacted } from "./contactReq";
import './Contact.css';

const Contact = () => {
    // const { t } = useTranslation("Contact");
    const [isBouncing, setIsBouncing] = useState(false);

    const handleContact = async () => {
        try {
            // Increment 'contacted' field in the backend
            await incrementContacted();
            console.log('Contacted incremented');
        } catch (error) {
            console.error('Failed to increment contacted field:', error);
        }

        // Redirige pour appeler le 1221
        window.location.href = "tel:1221";
    };

    useEffect(() => {
        // Déclenche l'animation à des intervalles aléatoires
        const interval = setInterval(() => {
            setIsBouncing(true);
            setTimeout(() => setIsBouncing(false), 1000); // Durée de l'animation
        }, Math.random() * 3000 + 5000); // Entre 5 et 10 secondes

        return () => clearInterval(interval); // Nettoie l'intervalle
    }, []);

    return (
        <div className="contact-container">
            <div 
                className={`floating-card ${isBouncing ? "bouncing" : ""}`} 
                onClick={handleContact}
            >
                <img 
                    src="/Pictures/call_emergency.png" 
                    alt="Atsala Logo" 
                    className="logo-atsala" 
                />
                {/* <p>{t("contact_professional")}</p> */}
            </div>
        </div>
    );
};

export default Contact;
