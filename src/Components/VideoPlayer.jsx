import React, { useEffect, useRef } from "react";

const VideoPlayer = ({ user }) => {
  const ref = useRef();
  useEffect(() => {
    user.videoTrack.play(ref.current);
  }, [user]);
  return (
    <div>
      {/* Uid: {user.uid} */}
      <div
        ref={ref}
        style={{ width: 300, height: 220, borderRadius: 10 }}
      ></div>
    </div>
  );
};

export default VideoPlayer;
