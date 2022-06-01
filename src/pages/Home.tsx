import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons'

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';

import '../styles/auth.scss';

import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';
import Swal from 'sweetalert2';


/* nota:
    useHistory está depreciado. Neste caso, usa-se o useNavigate:

    ANTES:---------------------------
    const navigate = useHistory();

    function navigateToNewRoom() {
        navigate.push('/rooms/new');
    }
    ---------------------------------
    AGORA:---------------------------
    const navigate = useNavigatey();

    function navigateToNewRoom() {
        navigate('/rooms/new');
    }
    ---------------------------------
*/

export function Home() {

    const navigate = useNavigate();
    const { user, signInWithGoogle } = useAuth();
    const [roomCode, setRoomCode] = useState('');
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    async function handleCreateRoom() {

        if (!user) {
            await signInWithGoogle();
        }

        navigate('/rooms/new');

    }

    async function handleJoinRoom(event: FormEvent) {

        event.preventDefault();

        if (roomCode) {
            if (roomCode.trim() === '') {
                return;
            }
            
            const roomRef = await database.ref(`rooms/${roomCode}`).get();
    
            if (!roomRef.exists()) {
                Toast.fire({
                    icon: 'warning',
                    title: 'Ops! Sala não encontrada.'
                })
                return;
            }
    
            if (roomRef.val().endedAt) {
                Toast.fire({
                    icon: 'warning',
                    title: 'Que pena... Sala já encerrada.'
                })
                return;
            }
    
            navigate(`/rooms/${roomCode}`);
        } else {
            navigate(`/rooms/list`);
        }
    }

    return (
        <div id="page-auth">
            <script src="https://kit.fontawesome.com/3d6d5a4df4.js"></script>
            <aside>
                <img src={illustrationImg} alt="Ilustração" />
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire dúvidas de sua audiência em tempo-real.</p>
            </aside>
            <main>
                <div className="main-content">
                    <img className="logo-home" src={logoImg} alt="Logotipo" />
                    <button onClick={handleCreateRoom} className="create-room">
                        <img src={googleIconImg} alt="Logo Google" />
                        Crie sua sala com o Google
                    </button>
                    <div className="separator">ou entre em uma sala</div>
                    <form onSubmit={handleJoinRoom}>
                        <input 
                            type="text"
                            placeholder="Digite o código da sala..."
                            onChange={event => setRoomCode(event.target.value)}
                            value={roomCode}
                        />
                        <Button type="submit">
                            <FontAwesomeIcon className='button-icon' icon={roomCode ? faArrowRightToBracket : faList} />
                            {roomCode ? 'Entrar na sala' : 'Lista de Salas'}
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    )
}