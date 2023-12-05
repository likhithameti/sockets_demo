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
                <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #ddd' }}>
                            <th style={{ padding: '8px', textAlign: 'left' }}>IpAddress</th>
                            <th style={{ padding: '8px', textAlign: 'left' }}>RegionName</th>
                            <th style={{ padding: '8px', textAlign: 'left' }}>City</th>
                        </tr>
                    </thead>
                <tbody>
                {visitors.map((visitor, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                        <td style={{ padding: '8px', textAlign: 'left' }}>{visitor.ipAddress}</td>
                        <td style={{ padding: '8px', textAlign: 'left' }}>{visitor.regionName}</td>
                        <td style={{ padding: '8px', textAlign: 'left' }}>{visitor.city}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            ) : (
            <p>No one connected</p>
            )}
        </>
    );
}

export default LiveVisitors;
