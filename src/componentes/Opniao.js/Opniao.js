// import React, { useState, useEffect } from "react";
import React from "react";
import "./Opniao.css";
// import Rating from "../rating/Rating";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faStar } from "@fortawesome/free-solid-svg-icons";
// import { getDocs, collection } from "firebase/firestore";
// import { database } from "../../firebase";
// import { useParams } from "react-router-dom";
// import { useNavigate } from "react-router-dom";


const Opniao = () => {


  return (
    <div className="comments">
            <div className="commentsCh1">
              <div className="comBox">
                <div className="comName">
                  {/* <h3>{medico.name}</h3> */}
                </div>
              </div>
              <div className="comDate">
                {/* <p>{medico.timestamp}</p> */}
              </div>
            </div>

            <div className="comReview">
              <p>
                {/* {medico.opinion} */}
              </p>
            </div>
          </div>
  )
}

export default Opniao