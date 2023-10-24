import React, { useEffect } from "react";
import ChatContainer from "./ChatContainer";
import TinderCard from "react-tinder-card";
import { useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { debounce } from "lodash";
import i1 from "../images/ogmatch1.png";
import { useSocket } from "./SocketContext";

const Dashboard = () => {
  /*eslint-disable */
  const [user, setUser] = useState(null);
  const [genderedUsers, setGenderedUsers] = useState(null);
  const [setLastDirection] = useState();
  const [cookies] = useCookies(["user"]);
  const [swipedUserIds, setSwipedUserIds] = useState([]);
  const [gotmatch, setGotMatch] = useState(false);
  const [url, setUrl] = useState("");
  const [sameCollegeUsers, setSameCollegeUsers] = useState([]);
  const [otherCollegeUsers, setOtherCollegeUsers] = useState([]);
  const [frontuser, setFrontUser] = useState();
  const socket = useSocket();
  const [isOnline, setIsOnline] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  const userId = cookies.UserId;

  const updateStatus = async () => {
    try {
      await axios.put("http://localhost:8000/updatestatus", { isOnline, userId });
    } catch (err) {
      console.log(err);
    }
  };


  // getting user to fill all information
  const getUser = async () => {
    console.log("getuser called");
    try {
      const response = await axios.get("http://localhost:8000/user", {
        params: { userId },
      });
      setUser(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  // getting other users as per our interest
  const getGenderedUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/gendered-users", {
        params: { gender: user?.gender_interest },
      });
      setGenderedUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (user) {
      getGenderedUsers();
    }
    const handleUserStatusChanged = async ({ userId: changedUserId, online }) => {
      console.log("connected");
      if (changedUserId === userId) {
        setIsOnline(online);
        await updateStatus();
      }
    };

    socket.on("userStatusChanged", handleUserStatusChanged);
    socket.emit("user-joined", userId);
    return () => {
      // Disconnect the WebSocket when the component unmounts
      console.log("demounting");
      socket.off("userStatusChanged", handleUserStatusChanged);
    };
  }, [user]);

  useEffect(() => {
    if (genderedUsers) {
      let matchedUserIds = user?.matches.map(({ user_id }) => user_id).concat(userId);
      const filteredGenderedUsers = genderedUsers.filter((genderedUser) => !matchedUserIds.includes(genderedUser.user_id));

      // Filter users from the same college
      if (user.college) {
        const sameCollege = filteredGenderedUsers.filter((genderedUser) => genderedUser.college === user.college);
        setSameCollegeUsers(sameCollege);
      }

      // Filter users from other colleges
      const otherColleges = filteredGenderedUsers.filter((genderedUser) => genderedUser.college !== user.college);
      setOtherCollegeUsers(otherColleges);
    }
  }, [user, genderedUsers]);

  const updateMatches = async (matchedUserId) => {
    try {
      await axios.put("http://localhost:8000/addmatch", {
        userId,
        matchedUserId,
      });
      console.log("updateMatches called");

      getUser();
    } catch (err) {
      console.log(err);
    }
  };

  const ismatch = async (userId, swipedUserId) => {
    console.log("ismatch called");
    try {
      const response = await axios.get("http://localhost:8000/ismatch", {
        params: { userId, swipedUserId },
      });
      const responsetext = await response.data.find.toString();
      const user2 = await response.data.user2;
      console.log(responsetext, "json");
      if (responsetext === "true") {
        setGotMatch(true);
        setUrl(user2.url);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // In your component, use the sortUsersByCollege function to sort the users
  const sortedUsers = [...sameCollegeUsers, ...otherCollegeUsers];

  const debouncedSwiped = debounce(async (direction, swipedUser) => {

    if (!swipedUserIds.includes(swipedUser) && direction === "right") {
      // Only update matches if the user hasn't been swiped right before
      await updateMatches(swipedUser);
      setFrontUser(swipedUser);
      setSwipedUserIds([...swipedUserIds, swipedUser]);
      setShowDetails(!showDetails)
    }

    // setLastDirection(direction);
    setShowDetails(!showDetails)

  }, 500); // Adjust debounce delay

  useEffect(() => {
    if (frontuser) ismatch(userId, frontuser);
  }, [frontuser]);


  const cardClick = ()=>{
    setShowDetails(!showDetails)
  }

  return (
    <>
      <div className={`match-overlay ${gotmatch ? "visible" : ""}`}>
        <div className="match-message">
          <button onClick={() => setGotMatch(false)} className="close-button">
            Close
          </button>
          <img src={i1} alt="" className="tinder-match" />
          <div className="user-images">
            {url && <img src={require(`../images/${url}`)} alt="" />}
            {user && <img src={require(`../images/${user.url}`)}></img>}
          </div>
        </div>
      </div>

      {user && (
        <div className="dashboard">
          <ChatContainer user={user} gotmatch={gotmatch} setGotMatch={setGotMatch} />
          <div className="swipe-container">
            <div className="card-container" onClick={cardClick}>
              {sortedUsers?.reverse().map((genderedUser) => (
                <TinderCard
                  className="swipe"
                  key={genderedUser.user_id}
                  onSwipe={(direction) => {
                    debouncedSwiped(direction, genderedUser.user_id);
                  }}
                  onCardLeftScreen={""}
                  preventSwipe={["up", "down", "upright", "downright", "upleft", "downleft"]}
                >
                  
      
                  <div style={{ backgroundImage: "url(" + require(`../images/${genderedUser?.url}`).replace(/\s/g, "") + ")" }} className="card">
                  <div className={`additional-details ${showDetails ? 'open' : ''}`}>
                    <div className="name">
                    <h3>
                        {genderedUser.first_name}, {genderedUser.age}
                      </h3>
                      <span>{genderedUser.college}</span>
                    </div>
                    <div className="about">
                      <h2>About Me</h2>
                      <span>{genderedUser.about}</span>
                    </div>
                  </div>
                    <div className="card-info">
                      <h3>
                        {genderedUser.first_name}, {genderedUser.age}
                      </h3>
                      <span>{genderedUser.college}</span>
                    </div>
                  </div>
                </TinderCard>
              ))}
            </div>
            
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
