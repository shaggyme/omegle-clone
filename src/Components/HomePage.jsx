import "./HomePage.css";
import VideoPlayer from "./VideoPlayer";
import logo from "../assets/omegle-logo.png";
import AgoraRTC from "agora-rtc-sdk-ng";
import { useEffect } from "react";
import { useState } from "react";

const APP_ID = "cb0da42d421b449fb72fa83802003252";
const TOKEN =
  "007eJxTYBByubBg2pv02sNX6ia5TjcoTv0s8I3rpHbKpH+X+162Ct1TYEhOMkhJNDFKMTEyTDIxsUxLMjdKS7QwtjAwMjAwNjI1crXzSWsIZGT4b3SAiZEBAkF8ZobylCwGBgCb5yAB";
const CHANNEL = "wdj";

const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

const Body = () => {
  const [users, setUsers] = useState([]);
  const [localTracks, setLocalTracks] = useState([]);
  const handleUserJoined = async (user, mediaType) => {
    await client.subscribe(user, mediaType);

    if (mediaType === "video") {
      setUsers((previousUsers) => [...previousUsers, user]);
    }

    if (mediaType === "audio") {
      user.audioTrack.play();
    }
  };

  const handleUserLeft = (user) => {
    setUsers((previousUsers) =>
      previousUsers.filter((u) => u.uid !== user.uid)
    );
  };

  useEffect(() => {
    client.on("user-published", handleUserJoined);
    client.on("user-left", handleUserLeft);

    client
      .join(APP_ID, CHANNEL, TOKEN, null)
      .then((uid) =>
        Promise.all([AgoraRTC.createMicrophoneAndCameraTracks(), uid])
      )
      .then(([tracks, uid]) => {
        const [audioTrack, videoTrack] = tracks;
        setLocalTracks(tracks);
        setUsers((previousUsers) => [
          ...previousUsers,
          {
            uid,
            videoTrack,
            audioTrack,
          },
        ]);
        client.publish(tracks);
      });

    return () => {
      for (let localTrack of localTracks) {
        localTrack.stop();
        localTrack.close();
      }
      client.off("user-published", handleUserJoined);
      client.off("user-left", handleUserLeft);
      client.off();
      client.unpublish(tracks).then(() => client.leave());
    };
  }, []);

  return (
    <div className="body-container">
      <header className="omegle-header">
        <div className="header-container">
          <img src={logo} alt="Omegle Logo" className="logo" />
          <h1 className="tagline">Talk to strangers!</h1>
        </div>
      </header>
      <main className="content">
        <div className="video-container">
          <div className="video-box local-video">
            {users[0] && <VideoPlayer key={users[0].uid} user={users[0]} />}
          </div>
          <div className="video-box remote-video">
            {users[1] ? (
              <VideoPlayer key={users[1].uid} user={users[1]} />
            ) : (
              <div>No video found</div>
            )}
          </div>
        </div>
        <div className="chat-container">
          <div className="chat-box">
            <div className="chat-content"></div>
            <div className="chat-footer">
              <button className="next-btn">Next</button>
              <input
                type="text"
                placeholder="Type a message..."
                className="chat-input"
              />
              <button className="send-btn">Send</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Body;
