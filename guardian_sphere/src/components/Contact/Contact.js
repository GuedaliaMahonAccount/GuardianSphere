import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import './Contact.css';

const Contact = () => {
    const { t } = useTranslation("Contact"); // Namespace 'Contact' for translations
    const navigate = useNavigate();
    const [isBouncing, setIsBouncing] = useState(false);



    const handleNavigate = () => {
        navigate("/doctors"); // Navigate to the doctors route
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
                onClick={handleNavigate}
            >
                {t("contact_professional")}
            </div>
        </div>
    );
};

export default Contact;
