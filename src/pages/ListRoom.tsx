import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentAlt, faSpinner } from "@fortawesome/free-solid-svg-icons";

import illustrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";
import emptyImg from "../assets/images/empty-rooms.png";

import "../styles/auth.scss";

import { Button } from "../components/Button";
import { database } from "../services/firebase";

export function ListRoom() {
  const navigate = useNavigate();
  const [searchRoom, setSearchRoom] = useState("");
  const [rooms, setRooms] = useState<Array<any>>([]);
  const [resultPesquisa, setResultPesquisa] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let aux = [];
    if (searchRoom.length) {
      let termo = searchRoom.toLowerCase().trim().replaceAll(" ", "");
      aux = rooms?.filter((room) => {
        let nomeSala: string = room.title
          .toLowerCase()
          .trim()
          .replaceAll(" ", "");
        return nomeSala.includes(termo);
      });
    } else {
      aux = [];
    }
    setResultPesquisa(aux);
  }, [searchRoom]);

  useEffect(() => {
    const roomsId = database.ref("rooms");

    roomsId.on("value", (snapshot) => {
      var array: Array<any> = [];
      array = Object.keys(snapshot.val()).map((key: string) => {
        const aux = { ...snapshot.val()[key], id: key };
        return aux;
      });

      array = array.filter((rooms) => !rooms.endedAt);

      setRooms(array);

      setLoading(false);
    });

    return () => roomsId.off();
  }, []);

  async function handleEnterRoom(id: string) {
    navigate(`../rooms/${id}`);
  }

  return (
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Ilustração" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire dúvidas de sua audiência em tempo-real.</p>
      </aside>
      <main>
        <div className="main-content">
          <img
            className="logo"
            src={logoImg}
            alt="Logotipo"
            onClick={() => navigate("/")}
          />
          <h2> </h2>
          <form>
            <div className="search">
              <input
                type="text"
                placeholder="Pesquisar por nome..."
                onChange={(event) => setSearchRoom(event.target.value)}
                value={searchRoom}
              />
            </div>
            <div className="separator">
              <div className="iconSeparator">
                <span>{searchRoom.length ? resultPesquisa.length : rooms.length}</span>
                <FontAwesomeIcon icon={faCommentAlt}></FontAwesomeIcon>
              </div>
            </div>
            {!loading ? (
              <>
                {rooms.length < 1 ? (
                  <img className="empty" src={emptyImg} alt="Nenhuma sala" />
                ) : (
                  <>
                    {!searchRoom?.length && (
                      <div
                        className={rooms.length < 4 ? "list" : "list-overflow"}
                      >
                        {rooms.map((room) => (
                          <Button
                            key={room.id}
                            onClick={() => handleEnterRoom(room.id)}
                          >
                            <span>{room.title}</span>
                          </Button>
                        ))}
                      </div>
                    )}
                  </>
                )}
                {searchRoom?.length > 0 && (
                     
                  <div
                    className={
                      resultPesquisa.length < 4 ? "list" : "list-overflow"
                    }
                  >
                    {resultPesquisa.map((room) => (
                      <Button
                        key={room.id}
                        onClick={() => handleEnterRoom(room.id)}
                      >
                        <span>{room.title}</span>
                      </Button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <FontAwesomeIcon
                className="loading-icon"
                icon={faSpinner}
                spin
                size="2x"
              />
            )}
          </form>
        </div>
      </main>
    </div>
  );
}
