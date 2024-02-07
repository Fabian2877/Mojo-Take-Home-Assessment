import { useState, useEffect, useRef } from "react";
import Navigation from "./Navigation";

const MAX_PRICE_UPDATE_COUNT = 20;

function Crypto() {
  const [pairOne, setPairOne] = useState(null);
  const [pairTwo, setPairTwo] = useState(null);

  const connection = useRef(null);
  const priceUpdateCount = useRef(0);

  useEffect(() => {
    const socket = new WebSocket("wss://socket.polygon.io/crypto");

    //Establish Websocket connection

    socket.addEventListener("open", () => {
      socket.send("Connection Established");
      socket.send(
        `{"action":"auth","params":"${process.env.REACT_APP_POLYGON_API_KEY}"}`
      );
      socket.send(
        `{"action":"subscribe","params":"XT.X:BTC-USD,XT.X:ETH-USD"}`
      );
    });

    // Listen for events from server

    socket.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);

      // Get most recent price update
      const btcToUsd = data.findLast(({ pair }) => pair === "BTC-USD")?.p;
      const ethToUsd = data.findLast(({ pair }) => pair === "ETH-USD")?.p;

      if (btcToUsd !== undefined) {
        setPairOne(btcToUsd);
      }

      if (ethToUsd !== undefined) {
        setPairTwo(ethToUsd);
      }

      // close the socket after 20 price updates
      if (priceUpdateCount.current >= MAX_PRICE_UPDATE_COUNT) {
        connection.current.close();
      }

      priceUpdateCount.current++;
    });

    socket.addEventListener("error", console.log);

    connection.current = socket;

    return () => {
      //close socket after component unmount
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
            <p>BTC-USD</p>
            {pairOne}
          </div>
          <div>
            <p>ETH-USD</p>
            {pairTwo}
          </div>
        </div>
      </div>
    </>
  );
}

export default Crypto;
