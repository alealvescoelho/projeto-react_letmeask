import { FormEvent, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareFromSquare, faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

import { auth, database } from "../services/firebase";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/Button";
import { Question } from "../components/Question";
import { RoomCode } from "../components/RoomCode";
import logoDarkImg from "../assets/images/logo-dark.svg";
import logoImg from "../assets/images/logo.svg";
import emptyImg from "../assets/images/empty-questions.svg";
import "../styles/room.scss";
import { useRoom } from "../hooks/useRoom";
//import { ThemeButton } from "../components/ThemeButton";

type RoomParams = {
  id: string;
};

export function Room() {
  
  const themeCache = localStorage.getItem("letmeask-theme");
  const { user, signInWithGoogle } = useAuth();
  const params = useParams<RoomParams>();
  const [newQuestion, setNewQuestion] = useState("");
  const [newTheme, setNewTheme] = useState(themeCache ? themeCache : "light");
  const [themeHover, setThemeHover] = useState("");
  const roomId = params.id;
  const { questions, title, author } = useRoom(roomId);
  const navigate = useNavigate();

  async function handleLogin() {
    if (!user) {
      await signInWithGoogle();
    }
  }

  async function handleLogoff() {
    await auth.signOut();
    window.location.reload();
  }

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault();

    if (newQuestion.trim() === "") {
      return;
    }

    if (!user) {
      throw new Error("You must be logged in");
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isHighlighted: false,
      isAnswered: false,
    };

    await database.ref(`rooms/${roomId}/questions`).push(question);

    setNewQuestion("");
  }

  async function handleLikeQuestion(
    questionId: string,
    likeId: string | undefined
  ) {
    if (!user) {
      if (window.confirm("Only users can like asks. Do you want to login?")) {
        await signInWithGoogle();
      }
    } else {
      if (likeId) {
        await database
          .ref(`rooms/${roomId}/questions/${questionId}/likes/${likeId}`)
          .remove();
      } else {
        await database
          .ref(`rooms/${roomId}/questions/${questionId}/likes`)
          .push({
            authorId: user?.id,
          });
      }
    }
  }

  function renderQuestions(type = "default") {
    let aux = questions.filter(
      (question) => !(question.isAnswered || question.isHighlighted)
    );

    if (type === "answered") {
      aux = questions.filter((question) => question.isAnswered);
    }

    if (type === "highlighted") {
      aux = questions.filter((question) => question.isHighlighted);
    }

    aux = Array.isArray(aux) ? aux : [];

    return aux.map((question) => {
      return (
        <Question
          key={question.id}
          content={question.content}
          author={question.author}
          isAnswered={question.isAnswered}
          isHighlighted={question.isHighlighted}
          isDark={newTheme === "dark" ? true : false}
        >
          {!question.isAnswered && (
            <button
              className={`like-button ${question.likeId ? "liked" : ""}`}
              type="button"
              aria-label="Marcar como gostei"
              onClick={() => handleLikeQuestion(question.id, question.likeId)}
            >
              {question.likeCount > 0 && <span>{question.likeCount}</span>}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z"
                  stroke="#737380"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </Question>
      );
    });
  }

  function setTheme(theme: string) {

    setNewTheme(theme);

    localStorage.setItem("letmeask-theme",theme);

  }

  function getThemeIcon() {
    if (themeHover) {
      return themeHover === "dark" ? faMoon : faSun;
    } else {
      return newTheme === "dark" ? faMoon : faSun;
    }
  }

  return (
    <div id="page-room" className={newTheme === "dark" ? "dark" : ""}>
      <header className={newTheme === "dark" ? "dark" : ""}>
        <div className="content">
          <div className="logo-theme">
            {newTheme === "dark" ? (
              <img
                className="user-home"
                src={logoDarkImg}
                alt="Letmeask"
                onClick={() => navigate("/")}
              />
            ) : (
              <img
                className="user-home"
                src={logoImg}
                alt="Letmeask"
                onClick={() => navigate("/")}
              />
            )}
            <button
              onMouseEnter={() => {
                setThemeHover(newTheme === "dark" ? "light" : "dark");
              }}
              onMouseLeave={() => setThemeHover("")}
              className={newTheme === "dark" ? "dark" : "light"}
              onClick={() => setTheme(newTheme === "dark" ? "light" : "dark")}
            >
              <FontAwesomeIcon icon={getThemeIcon()} />
            </button>
          </div>
          <div>
            {newTheme === "dark" ? (
                <RoomCode isDark code={params.id ?? ""} />
            ) : (
                <RoomCode code={params.id ?? ""} />
            )}
            {(user?.id && author) && user?.id === author && newTheme === "dark" && 
                 (<Button
                     isDark
                     isOutlined
                     onClick={() => navigate(`../admin/rooms/${params.id}`)}
                    >Entrar como Dono
                 </Button>)
            }
             {(user?.id && author) && user?.id === author && newTheme !== "dark" && 
                 (<Button
                     isOutlined
                     onClick={() => navigate(`../admin/rooms/${params.id}`)}
                    >Entrar como Dono
                 </Button>)
            }
          </div>
        </div>
      </header>
      <main className={newTheme === "dark" ? "dark" : ""}>
        <div className="room-title">
          <h1>Sala: {title}</h1>
          {questions.length > 0 && (
            <span>
              {questions.length} pergunta{questions.length > 1 && "s"}
            </span>
          )}
        </div>
        <form onSubmit={handleSendQuestion}>
          <textarea
            placeholder="O que você quer perguntar?"
            onChange={(event) => setNewQuestion(event.target.value)}
            value={newQuestion}
          />
          <div className="form-footer">
            {user ? (
              <>
                <div className="user-info">
                  <img src={user.avatar} alt="..." />
                  <span>{user.name}</span>
                  <FontAwesomeIcon
                    className="logoff"
                    icon={faShareFromSquare}
                    onClick={handleLogoff}
                  />
                </div>
              </>
            ) : (
              <span>
                Para enviar uma pergunta,{" "}
                <button onClick={() => handleLogin()}>faça seu login</button>.
              </span>
            )}
            <Button type="submit" disabled={!user}>
              Enviar pergunta
            </Button>
          </div>
        </form>
        <div className="separator">?</div>

        <div className="question-list">{renderQuestions("highlighted")}</div>

        <div className="question-list">{renderQuestions()}</div>

        <div className="question-list">{renderQuestions("answered")}</div>

        {questions.length === 0 && (
          <div className="empty-question">
            <img src={emptyImg} alt="Nenhuma nova pergunta." />
          </div>
        )}
      </main>
    </div>
  );
}
