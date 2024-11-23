import {
    faDollarSign,
    faShekelSign,
    faEuroSign,
  } from "@fortawesome/free-solid-svg-icons";
  // import { FontAwesomeIcon} from "@fortawesome/react-fontawesome";
  import "./CurrencySelctor.css";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import { useDispatch, useSelector } from "react-redux";
  import { useEffect } from "react";
  
  function CurrencySelctor() {
  
    const dispatch = useDispatch();
  
    const currency = useSelector((state) => state.login.currency);
  
    const changeCurrency = (e) => {
      if (e.target.value === "USD") dispatch({ type: "currency", payload: faDollarSign });
      else if (e.target.value === "ILS") dispatch({ type: "currency", payload: faShekelSign });
      else if (e.target.value === "EUR") dispatch({ type: "currency", payload: faEuroSign });
      return;
    };
  
    useEffect(() => {
      dispatch({ type: "currency", payload: faShekelSign });
    }, [dispatch]);
  
    return (
  
    <div className="select_currency_container">
        <FontAwesomeIcon  className="currency_selector" icon={currency} />
  
      <select onChange={(e) => changeCurrency(e)}>
        <option value={"ILS"}>ILS</option>
        <option value={"USD"}>USD</option>
        <option value={"EUR"}>EUR</option>
      </select>
    </div>
    );
  }
  
  export default CurrencySelctor;
  