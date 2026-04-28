import React, {useState } from 'react';
import { Map, Marker } from 'pigeon-maps'

export default function MapProperty({lat, longt}){
    const[center, setCenter] = useState([lat, longt]);
    const color = `hsl(${0 % 360}deg 39% 70%)`
    

    return(
        <Map height= {400} center= {center} defaultZoom={17}>
            <Marker
                width={50}
                anchor={[lat, longt]}
                color={color}
                onClick={() => SpeechSynthesisUtterance(hue + 20)}
            />
            <Marker
                width={50}
                anchor={[lat, longt]}
                color={color}
                onClick={() => SpeechSynthesisUtterance(hue + 20)}>
            </Marker>   
        </Map>
    );
}