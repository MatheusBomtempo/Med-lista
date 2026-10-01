import React, { useState, useEffect } from 'react';
import './Comments.css';
import Rating from '../rating/Rating';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import {
  getDocs,
  collection,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { database } from '../../firebase';
import { useParams } from 'react-router-dom';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import userImageUrl from '../../imgs/defaulUser.jpg';
import { UserAuth } from '../../contexts/contextsAuth/AuthContext';

const Comments = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { user } = UserAuth();
  const [medico, setMedico] = useState(null);
  const [comments, setComments] = useState([]);
  const [visibleComments, setVisibleComments] = useState(2);

  const handleLoadMore = () => {
    setVisibleComments(visibleComments + 2);
  };

  useEffect(() => {
    const getMedico = async () => {
      try {
        const data = await getDocs(collection(database, 'medicos2'));
        const medicos = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        const medicoEncontrado = medicos.find((medico) => medico.id === userId);

        if (medicoEncontrado) {
          setMedico(medicoEncontrado);
          const commentsRef = collection(
            database,
            `medicos2/${medicoEncontrado.id}/comments`
          );
          const commentsSnapshot = await getDocs(commentsRef);

          const commentsData = [];

          commentsSnapshot.forEach((doc) => {
            const data = doc.data();
            commentsData.push({
              id: doc.id,
              consultationReason: data.consultationReason,
              name: data.name,
              opinion: data.opinion,
              timestamp: data.timestamp,
              mostrarComentario: data.mostrarComentario,
            });
          });

          setComments(commentsData);
        }
      } catch (err) {
        console.error(err);
      }
    };

    getMedico();
  }, [userId]);

  const handleHideComment = async (index) => {
    try {
      const comment = comments[index];
      const commentRef = doc(
        database,
        `medicos2/${medico.id}/comments/${comment.id}`
      );
      await updateDoc(commentRef, {
        mostrarComentario: false,
      });

      const updatedComments = [...comments];
      updatedComments[index].mostrarComentario = false;
      setComments(updatedComments);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="comments-container">
      {medico && (
        <div className="box" key={medico.id}>
          <div className="flexfoto" id="avaliaFlex">
            <div className="esqAva">
              <h2 className="mr-3">Avaliações:</h2>
              <Rating />
            </div>

            <div
              onClick={() => navigate(`/avaliacao/${medico.currentId}`)}
              className="dirAva"
            >
              <Button type="success" className="botaoCriarPerfil" id="btnAvl">
                Avaliar
              </Button>
            </div>
          </div>

          <hr className="separadorr" />

          <div>
            {comments.length > 0 ? (
              comments
                .filter((comment) => comment.mostrarComentario)
                .slice(0, visibleComments)
                .map((comment, index) => (
                  <div className="comments" key={comment.id || index}>
                    <div className="commentsCh1">
                      <div className="comBox">
                        <div className="comName">
                          <div className="userComentFt">
                            <img src={userImageUrl} alt="Foto do usuario" />
                          </div>
                          <div>
                            <h3>{comment.name}</h3>
                            <p id="comTrans">Paciente verificado</p>
                            <div className="comDate">
                              <p id="comTrans">
                                {comment.timestamp &&
                                comment.timestamp.toDate &&
                                typeof comment.timestamp.toDate === 'function'
                                  ? comment.timestamp.toDate().toLocaleString()
                                  : 'Data não foi computada'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="comReview">
                      <p>{comment.opinion}</p>
                    </div>
                    {user && user.uid === userId && (
                      <div className="denuncia">
                        <button onClick={() => handleHideComment(index)}>
                          Denunciar Comentário
                        </button>
                        <FontAwesomeIcon id='warningico' icon={faTriangleExclamation} />
                      </div>
                    )}

                    <hr className="separadorr" />
                  </div>
                ))
            ) : (
              <p className="ml-6">Nenhum comentário feito</p>
            )}
            {visibleComments <
              comments.filter((comment) => comment.mostrarComentario)
                .length && (
              <div className="butaum">
                <button onClick={handleLoadMore}>Ver mais</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Comments;
