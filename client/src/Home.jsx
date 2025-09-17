import { useEffect } from "react";
import useWebSocket from "react-use-websocket";
import throttle from "lodash.throttle";
import { useRef } from "react";
import { Cursor } from "./components/Cursor";

const renderCursor = (users, currentUsername) => {
  return Object.keys(users)
    .filter((uuid) => users[uuid].username !== currentUsername) // filter out users without username (not fully initialized)
    .map((uuid) => {
      const user = users[uuid];
      return (
        <Cursor
          key={uuid}
          userName={user.username}
          point={[user.state.x, user.state.y]}
        />
      );
    });
};

const renderUserList = (users) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 10,
        right: 10,
        background: "rgba(255,255,255,.8)",
        padding: 10,
        borderRadius: 5,
        boxShadow: "0 0 10px rgba(0,0,0,.1)",
        fontFamily: "sans-serif",
        fontSize: 14,
      }}
    >
      <strong>Online Users:</strong>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {Object.keys(users).map((uuid) => {
          const user = users[uuid];
          return (
            <li key={uuid}>
              {`${user.username} X: ${user.state.x}, Y:${user.state.y}`}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const Home = ({ username }) => {
  const WS_URL = "ws://127.0.0.1:8000";
  const { sendJsonMessage, lastJsonMessage } = useWebSocket(WS_URL, {
    queryParams: { username },
  });

  const THROTTLE_RATE = 50; // milliseconds
  const throttledSendJsonMessage = useRef(
    throttle(sendJsonMessage, THROTTLE_RATE)
  );
  // Notes: wrap with useRef to persist the same throttled function instance
  // otherwise a new throttled function will be created on every render which a lot becaouse of live mouse movement

  useEffect(() => {
    // ask the server  to send everyone's state cursor position when we (new client) join
    sendJsonMessage({ x: 0, y: 0 }); // initial position
    window.addEventListener("mousemove", (e) => {
      // this mousemove event will get fired many times per second when mouse moves
      // so it needs to be throttled or debounced in real world application
      // we can use lodash.throttle or lodash.debounce for that
      const message = {
        x: e.clientX,
        y: e.clientY,
      };
      throttledSendJsonMessage.current(message);
    });
  }, []);

  if (lastJsonMessage) {
    return (
      <>
        {renderCursor(lastJsonMessage, username)}
        {renderUserList(lastJsonMessage, username)}
      </>
    );
  }
  return <div>Home - Welcome {username}!</div>;
};

export default Home;
