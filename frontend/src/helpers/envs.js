export const getEnvsUrl = () => {
    console.log(import.meta.env, process.env, 'test');
    // eslint-disable-next-line no-undef
    const URL = import.meta.env.VITE_URL || process.env.VITE_URL;
    console.log(URL, 'url', 'env');
    return URL;
    
}
