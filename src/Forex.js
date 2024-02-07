import React, { useState, useEffect, useRef } from "react";
import Navigation from "./Navigation";

const MAX_PRICE_UPDATE_COUNT = 20;

function Forex() {
  const [pairOne, setPairOne] = useState(null);
  const [pairTwo, setPairTwo] = useState(null);

  const connection = useRef(null);
  const priceUpdateCount = useRef(0);

  useEffect(() => {
    const socket = new WebSocket("wss://socket.polygon.io/forex");

    socket.addEventListener("open", (event) => {
      socket.send("Connection Established");
      socket.send(
        `{"action":"auth","params":"${process.env.REACT_APP_POLYGON_API_KEY}"}`
      );
      socket.send(`{"action":"subscribe","params":"C.C:EUR-USD,C.C:CHF-USD"}`);
    });

    socket.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);

      const euroToUsd = data.findLast(({ p }) => p === "EUR/USD")?.a;
      const chfToUsd = data.findLast(({ p }) => p === "CHF/USD")?.a;

      if (euroToUsd !== undefined) {
        setPairOne(euroToUsd);
      }

      if (chfToUsd !== undefined) {
        setPairTwo(chfToUsd);
      }

      if (priceUpdateCount.current >= MAX_PRICE_UPDATE_COUNT) {
        connection.current.close();
      }
      priceUpdateCount.current++;
    });

    connection.current = socket;

    return () => {
      connection.current.close();
    };
  }, []);

  return (
    <>
      <Navigation />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "500px",
            justifyContent: "space-between",
          }}
        >
          <div>
            <p>EURO-USD</p>
            {pairOne}
          </div>
          <div>
            <p>CHF-USD</p>
            {pairTwo}
          </div>
        </div>
      </div>
    </>
  );
}

export default Forex;
