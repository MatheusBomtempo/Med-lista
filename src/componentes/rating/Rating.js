import React, { useState, useEffect } from "react";
import "./Rating.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { getDocs, collection } from "firebase/firestore";
import { database } from "../../firebase";
import { useParams } from "react-router-dom";

const Rating = () => {
  const { userId } = useParams();
  const [rating, setRating] = useState(0);
  const [totalOpinioes, setTotalOpinioes] = useState(0);

  useEffect(() => {
    const getMedico = async () => {
      try {
        const data = await getDocs(collection(database, "medicos2"));
        const medicos = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        const medicoEncontrado = medicos.find((med) => med.id === userId);

        if (medicoEncontrado) {
          const commentsRef = collection(
            database,
            `medicos2/${medicoEncontrado.id}/comments`
          );
          const commentsSnapshot = await getDocs(commentsRef);

          let totalRating = 0;
          let totalComments = 0;

          commentsSnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.rating) {
              totalRating += data.rating;
              totalComments += 1;
            }
          });

          const averageRating =
            totalComments > 0 ? totalRating / totalComments : 0;
          setRating(averageRating); //se quiser saber a media basta usar esta const rating.
          setTotalOpinioes(totalComments);
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
