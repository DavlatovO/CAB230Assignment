
import API_URL from "../config";

export default function RatedRental() {
    const getRatings = () => {
        const url = `${API_URL}/ratings`;
        const token = localStorage.getItem("token");

        return fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            },
        })
        .then(response => {
            if(!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => console.log(data.data[1]))
        .catch(error => console.log(error));
    };

    return (
        <>
        </>
    );
}