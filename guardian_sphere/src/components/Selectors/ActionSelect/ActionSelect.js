import React, { Fragment, useState, useRef, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import "./ActionSelect.css";

function ActionSelect(props) {
    const { t } = useTranslation(["Action"]);
    // const { state, setState, id, updateGoals, currentGoals, value, updateIndictors, currentIndictors } = props;
    const { state, setState, id, updateGoals, currentGoals, value} = props;
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(value || t('option_1'));
    const [inputValue, setInputValue] = useState(value || t('option_1'));
    const [isAdding, setIsAdding] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    const updateValue = (newValue) => {
        setSelectedValue(newValue);
        setInputValue(newValue);
        setState([...state.slice(0, id), { ...state[id], name: newValue }, ...state.slice(1 + id)]);
        setIsOpen(false);
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleInputBlur = () => {
        updateValue(inputValue);
        setIsAdding(false);
    };

    const removeItem = () => {
        setState([...state.slice(0, id), ...state.slice(1 + id)]);
        const goalsNewList = currentGoals.map(goal => ({
            ...goal,
            actions: goal.actions.filter((_, index) => index !== id)
        }));
        updateGoals(goalsNewList);
    };

    return (
        <Fragment>
            <div className='selector_container' ref={dropdownRef}>
                <div className="selector_box scrollable">
                    <button className="select_button scrollable" onClick={() => setIsOpen(!isOpen)}>
                        {selectedValue}
                    </button>
                    {isOpen && (
                        <div className="options_window">
                            <ul>
                                <li onClick={() => setIsAdding(true)}>
                                    {t('add_text')}
                                </li>
                                {[...Array(38)].map((_, i) => (
                                    <li key={i} onClick={() => updateValue(t(`option_${i + 1}`))}>
                                        {t(`option_${i + 1}`)}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {isAdding && (
                        <div className="input_window">
                            <input
                                type="text"
                                className="selector_input"
                                value={inputValue}
                                onChange={handleInputChange}
                                onBlur={handleInputBlur}
                                placeholder={t('custom_input')}
                            />
                        </div>
                    )}
                </div>
                <button type='button' className="remove_button" onClick={removeItem}>X</button>
            </div>
        </Fragment>
    );
}

export default ActionSelect;
