import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'

import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';
import emptyImg from '../assets/images/empty-questions.svg'
import logoImg from '../assets/images/logo.svg';
import logoDarkImg from '../assets/images/logo-dark.svg'
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';
import '../styles/room.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';


type RoomParams = {
    id: string;
}

export function AdminRoom() {

    const themeCache = localStorage.getItem("letmeask-theme");
    const { user } = useAuth()
    const params = useParams<RoomParams>();
    const roomId = params.id;
    const { questions, title, author } = useRoom(roomId);
    const navigate = useNavigate();
    const [ newTheme, setNewTheme ] = useState(themeCache ? themeCache : "light");
    const [themeHover, setThemeHover] = useState('');
    // const Toast = Swal.mixin({
    //     toast: true,
    //     position: 'top-end',
    //     showConfirmButton: false,
    //     timer: 2000,
    //     timerProgressBar: true,
    //     didOpen: (toast) => {
    //         toast.addEventListener('mouseenter', Swal.stopTimer)
    //         toast.addEventListener('mouseleave', Swal.resumeTimer)
    //     }
    // })

    useEffect(() => {

        if (!author) {
            return;
        }

        if (author === user?.id) {
            // if (newTheme === 'dark') {
            //     Toast.fire({
            //         background: '#29292e',
            //         color: '#f8f8f8',
            //         icon: 'success',
            //         title: 'Bem vindo de volta!'
            //     })
            // } else {
            //     Toast.fire({
            //         background: '#f8f8f8',
            //         color: '#29292e',
            //         icon: 'success',
            //         title: 'Bem vindo de volta!'
            //     })
            // }
            return;
        } else if (author !== user?.id || (author !== undefined || author !== null) || (user?.id !== undefined || user?.id !== null)) {
            console.log('author: ', author);
            console.log('user.id: ', user?.id);
            if (newTheme === 'dark') {
                Swal.fire({
                    background: '#29292e',
                    color: '#f8f8f8',
                    title: 'Opa!',
                    text: 'Aparentemente você não é o Administrador desta sala.',
                    icon: 'error',
                    confirmButtonText: 'Entendi.'
                })
                navigate("/");
            } else {
                Swal.fire({
                    background: '#f8f8f8',
                    color: '#29292e',
                    title: 'Opa!',
                    text: 'Aparentemente você não é o Administrador desta sala.',
                    icon: 'error',
                    confirmButtonText: 'Entendi.'
                })
                navigate("/");
            }
        }

    })

    function getThemeIcon() {
        if (themeHover) {
            return themeHover === "dark" ? faMoon : faSun
        } else {
            return newTheme === "dark" ? faMoon : faSun
        }
    }

    async function handleEndRoom() {

        if (newTheme === 'dark') {
            const { value: encerrar } = await Swal.fire({
                background: '#29292e',
                color: '#f8f8f8',
                icon: 'warning',
                title: 'Chega!',
                text: 'Deseja realmente encerrar esta sala?',
                confirmButtonText: 'Encerrar',
                cancelButtonText: 'Cancelar',
                showCancelButton: true,
            });

            if (encerrar) {
                await database.ref(`rooms/${roomId}`).update({
                    endedAt: new Date()
                });
                navigate('/');
            };
        } else {
            const { value: encerrar } = await Swal.fire({
                background: '#f8f8f8',
                color: '#29292e',
                icon: 'warning',
                title: 'Chega!',
                text: 'Deseja realmente encerrar esta sala?',
                confirmButtonText: 'Encerrar',
                cancelButtonText: 'Cancelar',
                showCancelButton: true,
            });

            if (encerrar) {
                await database.ref(`rooms/${roomId}`).update({
                    endedAt: new Date()
                });
                navigate('/');
            };
        }
    }

    async function handleCheckQuestionAsAnswered(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true,
            isHighlighted: false
        });
    }

    async function handleHighlightQuestion(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: true   
        });
        console.log('handleHighlightQuestion');
    }

    async function disableHighlightQuestion(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: false   
        });
        console.log('disableHighlightQuestion');
    }

    async function handleDeleteQuestion(questionId: string) {

        if (newTheme === 'dark') {
            const { value: deletar } = await Swal.fire({
                background: '#29292e',
                color: '#f8f8f8',
                icon: 'warning',
                title: 'Essa já foi!',
                text: 'Deseja deletar esta pergunta?',
                confirmButtonText: 'Deletar',
                cancelButtonText: 'Cancelar',
                showCancelButton: true,
            });

            if (deletar) {
                await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
            };
        } else {
            const { value: deletar } = await Swal.fire({
                background: '#f8f8f8',
                color: '#29292e',
                icon: 'warning',
                title: 'Essa já foi!',
                text: 'Deseja deletar esta pergunta?',
                confirmButtonText: 'Deletar',
                cancelButtonText: 'Cancelar',
                showCancelButton: true,
            });

            if (deletar) {
                await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
            };
        }

    }

    function setTheme(theme: string) {

        setNewTheme(theme);
        localStorage.setItem("letmeask-theme",theme);
    
    }

    function renderQuestions(type = "default"){

        let aux = questions.filter(question => !(question.isAnswered || question.isHighlighted));

        if(type === "answered"){
            aux = questions.filter(question => question.isAnswered);
        }
        
        if(type === "highlighted"){
            aux = questions.filter(question => question.isHighlighted);
        }

        aux = Array.isArray(aux) ? aux : [];

        return aux.map(question => {
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
                        <>
                            <button
                                type="button"
                                onClick={() => handleCheckQuestionAsAnswered(question.id)}
                            >
                            <img src={checkImg} alt="Marcar" />
                            </button>
                            {!question.isHighlighted ? 
                            (
                                <button
                                type="button"
                                onClick={() => handleHighlightQuestion(question.id)}>
                                <img src={answerImg} alt="Destacar" />
                                </button>
                            )
                            :
                            (
                                <button
                                type="button"
                                className='highlight-button'
                                onClick={() => disableHighlightQuestion(question.id)}>
                                <img src={answerImg} alt="Tirar destaque" />
                                </button>
                            )}
                        </>
                    )}
                    <button
                        type="button"
                        onClick={() => handleDeleteQuestion(question.id)}
                    >
                        <img src={deleteImg} alt="Deletar" />
                    </button>
                </Question>
            );
        })
    }

    return (
        <div id="page-room" className={ newTheme === "dark" ? "dark" : "" }>
            <header className={ newTheme === "dark" ? "dark" : "" }>
                <div className="content">
                <div className='logo-theme'>
                    {newTheme === "dark" ?
                        (<img className='user-home' src={logoDarkImg} alt="Letmeask" onClick={() => navigate('/')} />) :
                        (<img className='user-home' src={logoImg} alt="Letmeask" onClick={() => navigate('/')} />)}
                        <button onMouseEnter={() => {
                                setThemeHover(newTheme === "dark" ? "light" : "dark");}} 
                                onMouseLeave={() => setThemeHover('')}
                                className={newTheme === "dark" ? "dark" : "light"}
                                onClick={() => setTheme(newTheme === "dark" ? "light" : "dark")}>
                            <FontAwesomeIcon icon={getThemeIcon()} />
                        </button>
                    </div>
                    <div>
                        { newTheme === "dark" ? 
                            (<RoomCode isDark code={params.id ?? ''}/>) 
                            : 
                            (<RoomCode code={params.id ?? ''}/>)}
                        { newTheme === "dark" ? 
                            (<Button
                                isDark
                                isOutlined 
                                onClick={handleEndRoom}>Encerrar sala
                            </Button>) 
                            : 
                            (<Button
                                isOutlined 
                                onClick={handleEndRoom}>Encerrar sala
                            </Button>)}
                    </div>
                </div>
            </header>
            <main className={ newTheme === "dark" ? "dark" : "" }>
                <div className="room-title">
                    <h1>Sala: {title}</h1>
                    { questions.length > 0 && <span>{questions.length} pergunta{  questions.length > 1 && "s" }</span> }
                </div>
                <div className="separator">?</div>

                <div className="question-list">
                    {renderQuestions("highlighted")}
                </div>

                <div className="question-list">
                    {renderQuestions()}
                </div>

                <div className="question-list">
                    {renderQuestions("answered")}
                </div>

                {questions.length === 0 && (
                    <div className='empty-question'>
                        <img src={emptyImg} alt="Nenhuma nova pergunta." />
                    </div>
                )}
            </main>
        </div>
    );
}