import React, { useEffect, useState } from "react";
import axios from "axios";

import { io } from "socket.io-client";
const socket = io("http://localhost:4200");

function LiveVisitors() {
    const [visitors, setVisitors] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://geoplugin.net/json.gp");
                const {
                    geoplugin_request,
                    geoplugin_regionName,
                    geoplugin_city
                } = response.data;

                const visitor = {
                    "ipAddress": geoplugin_request,
                    "regionName": geoplugin_regionName,
                    "city": geoplugin_city,
                };

                socket.emit("new_visitor",visitor);

                socket.on("visitors", (visitors)=>{
                    setVisitors(visitors);
                })
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            {visitors.length > 0 ? (
            <div>
                {visitors.map((visitor, index) => (
                    <div key={index}>
                        <p>IpAddress: {visitor.ipAddress} </p>
                        <p>RegionName: {visitor.regionName} </p>
                        <p>City: {visitor.city} </p>
                    </div>
                ))}
            </div>) : (
                <p>No one connected</p>
            )}
        </>
    );
}

export default LiveVisitors;
