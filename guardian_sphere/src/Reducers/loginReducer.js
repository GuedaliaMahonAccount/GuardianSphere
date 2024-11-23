const defaultState = {
    user: {},
    token: "",
    isLoggedIn: false,
    loading: false,
    error: "",
    currency: "faShekelSign"
    };

const loginReducer = (state = defaultState, action) => {
    switch (action.type) {
        case "login":
            return { ...state, user: action.payload.user, token: action.payload.token, isLoggedIn: true };
        case "logout":
            return { ...state, user: {}, token: "", isLoggedIn: false };
        case "loading":
            return { ...state, loading: true };
        case "error":
            return { ...state, error: action.payload, loading: false };
        case "currency":
            return { ...state, currency: action.payload };
        default:
            return state;
    }
}

export default loginReducer;