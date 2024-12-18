const getBackendOrigin = () => {
    console.log('process.env.NODE_ENV:', process.env.NODE_ENV);
    if (process.env.NODE_ENV === 'development') {
        return 'http://localhost:8080';
    }
    return 'https://guardianspheres.com'; // Production backend origin
};

export const BASE_URL = getBackendOrigin();
