import axios from "axios";
import Nav from "../components/Nav";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader"
import { useSocket } from './SocketContext'

const OnBoarding = () => {
  /*eslint-disable */
  let navigate = useNavigate();
  const socket = useSocket()
  const [cookies] = useCookies(["user"]);
  const [image, setImage] = useState(null);
  const [gotImage, setGotImage] = useState("");
  const [error, SetError] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState("KSI Institute"); // Track the selected college separately
  const [formData, setFormData] = useState({
    user_id: cookies.UserId,
    first_name: "",
    dob_day: "",
    dob_month: "",
    dob_year: "",
    show_gender: false,
    gender_identity: "man",
    gender_interest: "woman",
    age: "",
    url: "",
    college:"",
    about: "",
    matches: [],
  });

  useEffect(()=>{
    const handleUserStatusChanged =async  ({ userId: changedUserId, online }) => {
      console.log("connected");
    };
    console.log("demounting");
    socket.off('userStatusChanged', handleUserStatusChanged);
  },[])

  //function to validate if the entered day is valid or not . for example feb has only 28/29 days so it should not be 31
  const isValidDate = () => {
    const day = parseInt(formData.dob_day, 10);
    const month = parseInt(formData.dob_month, 10);
    const year = parseInt(formData.dob_year, 10);

    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      return false;
    }

    // Basic validation for the number of days in each month
    const daysInMonth = new Date(year, month, 0).getDate();
    return day >= 1 && day <= daysInMonth && month >= 1 && month <= 12;
  };

  //funtion to calculate the age of user
  const calculateAge = () => {
    const day = parseInt(formData.dob_day, 10);
    const month = parseInt(formData.dob_month, 10);
    const year = parseInt(formData.dob_year, 10);

    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      return null; // Return null if any of the inputs is not a number
    }

    const dob = new Date(year, month - 1, day); // Month is 0-based in JavaScript
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();

    // Check if the birthday has already occurred this year
    if (today.getMonth() < dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) {
      return age - 1; // Subtract 1 from age if birthday hasn't occurred yet this year
    }

    return age;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      alert("Please enter a valid date of birth."); // Display an alert if the date is invalid
      return;
    }
    const age = calculateAge();
    if (age < 18) {
      alert("you are too young for tinder");
      return;
    }
    setLoading(true);
    formData.age = age;
    formData.college = selectedCollege
    const formData1 = new FormData();
    formData1.append("image", image);
    const image1 = formData1.get("image").name;
    formData.url = image1;
    try {
      const response = await axios.put("http://localhost:8000/user", { formData });
      const result = await axios.post("http://localhost:8000/upload-image", formData1, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const success = response.status === 200;
      setLoading(false);
      if (success) navigate("/dashboard");
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    setIsFormValid(isValidDate());
  }, [formData.dob_day, formData.dob_month, formData.dob_year]);

  let decidingaheadcode = "";
 
  const getImage = async () => {
    console.log("getimage called");
    setLoadingImage(true);
    const userId = cookies.UserId;
    const formData1 = new FormData();
    formData1.append("image", image);
    const image1 = formData1.get("image").name;
    formData.url = image1;
    try {
      const response = await axios.put("http://localhost:8000/user", { formData });
      const result = await axios.post("http://localhost:8000/upload-image", formData1, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (err) {
      console.log(err);
      setLoadingImage(false);
      formData.url = "";
      document.getElementById("url").value = "";
      console.log(err.response.status)
      if (err.response.status === 404) {
        decidingaheadcode = 404;
        SetError(true);
      }
    }

    if (decidingaheadcode === "") {
      SetError(false);
      try {
        const response = await axios.get("http://localhost:8000/user", {
          params: { userId },
        });
        setGotImage(response.data.url);
      } catch (err) {
        console.log(err);
        setLoadingImage(false);
      }
    }
    setLoadingImage(false);
  };


  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;

    const name = e.target.name;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(()=>{
    setFormData((prevState) => ({
      ...prevState,
      college: selectedCollege, // Use the selectedCollege state value
    }));
  }, [selectedCollege]);
 

  useEffect(() => {
    if (image != null) {
      getImage();
    }
  }, [image]);

  //handle onChange for image
  const handleChange1 = (e) => {
    console.log(e.target.files[0]);

    setImage(e.target.files[0]);
    console.log("yoyo", image);
  };
  let requiredImage;
  if (gotImage.length > 0) requiredImage = require(`../images/${gotImage}`);

  return (
    <>
      <Nav minimal={true} setShowModal={() => {}} showModal={false} />

      {loading && <div style={{marginTop: "13rem",fontSize: "5rem"}}>
    {<PulseLoader color="#FE3072"  size={30}/>}
    {<p style={{display:"inline",marginLeft:"62px"}}>Loading...</p>}
    </div>}
      {!loading && (
        <div className="onboarding">
          <h2>CREATE ACCOUNT</h2>

          <form onSubmit={handleSubmit}>
            <section>
              <label htmlFor="first_name">First Name</label>
              <input id="first_name" type="text" name="first_name" placeholder="First Name" required={true} value={formData.first_name} onChange={handleChange} maxLength={12} />

              <label>Birthday</label>
              <div className="multiple-input-container">
                <input
                  id="dob_day"
                  type="number"
                  name="dob_day"
                  placeholder="DD"
                  required={true}
                  value={formData.dob_day}
                  onChange={handleChange}
                  onWheel={(e) => e.target.blur()} // Disable the input when scrolling
                  onFocus={(e) => e.target.select()} // Selthis event handler to prevent scrolling
                  min="1"
                  max="31"
                />

                <input
                  id="dob_month"
                  type="number"
                  name="dob_month"
                  placeholder="MM"
                  required={true}
                  value={formData.dob_month}
                  onChange={handleChange}
                  onWheel={(e) => e.target.blur()} // Disable the input when scrolling
                  onFocus={(e) => e.target.select()} //  Add this event handler to prevent scrolling
                  min="1"
                  max="12"
                />

                <input
                  id="dob_year"
                  type="number"
                  name="dob_year"
                  placeholder="YYYY"
                  required={true}
                  value={formData.dob_year}
                  onChange={handleChange}
                  onWheel={(e) => e.target.blur()} // Disable the input when scrolling
                  onFocus={(e) => e.target.select()} // Selthis event handler to prevent scrolling
                  min="1000"
                  max="2023"
                />
                {!isFormValid && <p style={{ color: "red" }}>Invalid date of birth</p>}
              </div>

              <label>Gender</label>
              <div className="multiple-input-container">
                <input id="man-gender-identity" type="radio" name="gender_identity" value="man" onChange={handleChange} checked={formData.gender_identity === "man"} />
                <label htmlFor="man-gender-identity">Man</label>
                <input id="woman-gender-identity" type="radio" name="gender_identity" value="woman" onChange={handleChange} checked={formData.gender_identity === "woman"} />
                <label htmlFor="woman-gender-identity">Woman</label>
                <input id="more-gender-identity" type="radio" name="gender_identity" value="more" onChange={handleChange} checked={formData.gender_identity === "more"} />
                <label htmlFor="more-gender-identity">More</label>
              </div>

              <label>Show Me</label>
              <div className="multiple-input-container">
                <input id="man-gender-interest" type="radio" name="gender_interest" value="man" onChange={handleChange} checked={formData.gender_interest === "man"} />
                <label htmlFor="man-gender-interest">Man</label>
                <input id="woman-gender-interest" type="radio" name="gender_interest" value="woman" onChange={handleChange} checked={formData.gender_interest === "woman"} />
                <label htmlFor="woman-gender-interest">Woman</label>
                <input id="everyone-gender-interest" type="radio" name="gender_interest" value="everyone" onChange={handleChange} checked={formData.gender_interest === "everyone"} />
                <label htmlFor="everyone-gender-interest">Everyone</label>
              </div>

              <label htmlFor="college">Select your college</label>
              <select name="college" id="college"  onChange={(e) => setSelectedCollege(e.target.value)} className="scrollable-dropdown">
                <option value="KSI Institute">KSI Institute</option>
                <option value="Patkar College">Patkar College</option>
                <option value="Bhavans College">Bhavans College</option>
                <option value="Valia College">Valia College</option>
                <option value="Mitibai College">Mitibai College</option>
                <option value="KJ Somaiya College">KJ Somaiya College</option>
                <option value="Xavier College">Xavier College</option>
                <option value="Jai Hind College">Jai Hind College</option>
                <option value="NM College">NM College</option>
                <option value="Rizvi College">Rizvi College</option>
                <option value="SNDT College">SNDT College</option>
                <option value="Hinduja  College">Hinduja College</option>
              </select>

              <label htmlFor="about">About me</label>
              <input id="about" type="text" name="about" required={true} placeholder="I like long walks..." value={formData.about} onChange={handleChange} minLength={10} maxLength={300}/>

              <input type="submit" disabled={!isFormValid || loadingImage} />
            </section>

            <section>
              <label htmlFor="url">Profile Photo</label>
              <input type="file" name="url" id="url" onChange={handleChange1} required={true} accept="image/*" />
              <div className="photo-container">
                {loadingImage && <div style={{textAlign:"center",fontSize: "5rem"}}>
                 {<PulseLoader color="#FE3072"  size={30}/>}
                </div>}
                {!loadingImage && error ? <p style={{ color: "red", fontSize: "20px" }}>JPEG OR PNG Image Is Not Accepted! Please Select Jpg Image.</p> : ""}
                {!error && !loadingImage && requiredImage && <img src={requiredImage} alt="profile pic preview" />}
              </div>
            </section>
          </form>
        </div>
      )}
    </>
  );
}; 
export default OnBoarding;
