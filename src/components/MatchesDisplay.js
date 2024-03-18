import React from 'react'
import axios from 'axios'
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import PulseLoader from "react-spinners/PulseLoader"
import { useSocket } from './SocketContext';

const MatchesDisplay = ({matches , setClickedUser , gotmatch1 , isVisible}) => {
  const [matchedProfiles, setMatchedProfiles] = useState([])
  const [cookies] = useCookies(null);
  const[loading,setLoading] = useState(false)
  const [gotMatch, setGotMatch] = useState(gotmatch1);
  const socket = useSocket()
  const [statusChanged, setStatusChanged] = useState(false);


  const matchedUserIds = matches.map(({ user_id }) => user_id)
  const userId = cookies.UserId;

  // eslint-disable-next-line
  useEffect(() => {
    getMatches();

    socket.on("userStatusChanged", (data) => {
      setStatusChanged(true); 
    });
    // eslint-disable-next-line
  }, [matches, statusChanged]); 

  // useEffect(() => {
  //   getMatches();
  
    
  //   socket.on('userStatusChanged', (data) => {
      
  //     const updatedProfiles = matchedProfiles.map((profile) =>
  //       profile.user_id === data.userId ? { ...profile, status: data.status } : profile
  //     );
  //     setMatchedProfiles(updatedProfiles);
  //   });
  //   console.log(matchedProfiles,"dekh")
  
  // }, [matches]);
  


  const getMatches = async () => {
    try {
      setLoading(true)
      const response = await axios.get("http://localhost:8000/users", {
        params: { userIds: JSON.stringify(matchedUserIds) },
      });
      setMatchedProfiles(response.data);
      setLoading(false)
    } catch (error) {
      console.log(error);
      setLoading(false)
    }
   setLoading(false)
  }

  useEffect(() => {
    if (statusChanged) {
      getMatches();
      setStatusChanged(false); 
    }
    // eslint-disable-next-line
  }, [statusChanged]);

  const getStatusDotStyle = (status) => {
    return {
      width: "10px",
      height: "10px",
      borderRadius: "50%",
      backgroundColor: status ? "#00da00" : "red",
      display: "inline-block",
      marginLeft: "-18px",
      marginTop: "20px",
    };
  };

  useEffect(() => {
    getMatches();
    setGotMatch(true)
  }, [matches]);

  const filteredMatchedProfiles = matchedProfiles?.filter(
    (matchedProfile) =>
      matchedProfile.matches.filter((profile) => profile.user_id === userId)
        .length > 0
  );

  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  return (
    <div className="matches-display" style={{display: isVisible ? 'none' : 'block' }}>
      {loading && <div style={{textAlign:"center",fontSize: "5rem"}}>
          {<PulseLoader color="#FE3072"  size={15}/>}
          </div>}
      {!loading && filteredMatchedProfiles?.map((match, _index) => (
        <div
          key={match.user_id}
          className="match-card"
          onClick={() => setClickedUser(match)}
        >
          <div className="img-container">
            <img src={require(`../images/${match?.url}`)} alt={match?.first_name + " profile"} />
          </div>
            <div
                style={getStatusDotStyle(match.status)}
                title={match.status ? "Online" : "Offline"}
              ></div>
          {/* <p>{match.status?"Online":"Offline"}</p> */}
          <h3 style={{marginLeft:"11px"}}>{capitalize(match?.first_name)}</h3>
        </div>
      ))}
    </div>
  )
}

export default MatchesDisplay
