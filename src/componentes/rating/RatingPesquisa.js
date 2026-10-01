import React, { useState, useEffect } from "react";
import "./Rating.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { getDoc, doc, collection, getDocs, updateDoc } from "firebase/firestore";
import { database } from "../../firebase";

const Rating = ({ userId }) => {
  const [rating, setRating] = useState(0);
  const [totalOpinioes, setTotalOpinioes] = useState(0);

  useEffect(() => {
    const getMedico = async () => {
      try {
        const medicoRef = doc(database, `medicos2/${userId}`);
        const medicoDoc = await getDoc(medicoRef);

        if (medicoDoc.exists()) {
          const commentsRef = collection(medicoRef, "comments");
          const commentsSnapshot = await getDocs(commentsRef);

          let totalRating = 0;
          let totalComments = 0;

          commentsSnapshot.forEach((commentDoc) => {
            const commentData = commentDoc.data();
            if (commentData.rating !== undefined) {
              totalRating += commentData.rating;
              totalComments += 1;
            }
          });

          const averageRating = totalComments > 0 ? totalRating / totalComments : 0;
          setRating(averageRating);
          setTotalOpinioes(totalComments);

          // Atualiza ou cria o campo rateavg no documento do médico com a média das avaliações
          await updateDoc(medicoRef, {
            rateavg: averageRating
          });
        }
      } catch (err) {
        console.error(err);
      }
    };

    getMedico();
  }, [userId]);

  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < Math.floor(rating)) {
        stars.push(
          <FontAwesomeIcon
            key={i}
            id="estrela"
            icon={faStar}
          />
        );
      }
    }
    return stars;
  };

  return (
    <div className="estrelinhas">
      {totalOpinioes === 0 ? (
        "0 avaliações"
      ) : (
        <>
          {renderStars()}
          {` de ${totalOpinioes.toFixed(0)} avaliações`}
        </>
      )}
    </div>
  );
};

export default Rating;
