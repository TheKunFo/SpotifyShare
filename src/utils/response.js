export const checkResponse = (res) => {
    console.log(res)
    if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
    }
    return res.json();
};