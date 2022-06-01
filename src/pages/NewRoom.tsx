import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';

import '../styles/auth.scss';

import { Button } from '../components/Button';
import { database } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';
import Swal from 'sweetalert2';


export function NewRoom() {

    const { user } = useAuth();
    const [list, setList] = useState([] as any);
    const [newRoom, setNewRoom] = useState('');
    const navigate = useNavigate();
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

    useEffect(() => {

        const roomsLits = database.ref('rooms');

        var array: Array<any> = [];

        roomsLits.on('value', (snapshot) => {
            array = Object.keys(snapshot.val()).map((key: string) => {
                const aux = {...snapshot.val()[key], id: key};
                return aux
            })
            array = array.filter(rooms => !rooms.endedAt);
            array = array.filter(rooms => newRoom.includes(rooms.title) === true);

            if (array.length > 0) {
                setList(array);
            } else {
                setList([]);
            }
        })

        return () => roomsLits.off();

    },[newRoom])

    async function handleCreateRoom(event: FormEvent) {

        event.preventDefault();
        
        if (newRoom.trim() === '') { //trim => retira os espaços a esquerda e a direita;
            return;
        }

        const roomRef = database.ref('rooms');

        console.log(list);

        if (list.length > 0 && list !== null) {
            Toast.fire({
                icon: 'warning',
                title: 'Foi mal! Já existe uma sala com esse nome.'});
            return;
        } else {

            const firebaseRoom = await roomRef.push({
                title: newRoom,
                authorId: user?.id,
            })
    
            navigate(`/admin/rooms/${firebaseRoom.key}`)

            Swal.fire({
                title: 'Parabéns!',
                text: 'Você criou uma sala com sucesso.',
                icon: 'success',
                confirmButtonText: 'Obrigado.'
            })
        }
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
                    <img src={logoImg} alt="Logotipo" onClick={() => navigate('/')}/>
                    <h2>Criar uma nova sala</h2>
                    <form onSubmit={handleCreateRoom}>
                        <input 
                            type="text"
                            placeholder="Nome da sala..."
                            onChange={event => setNewRoom(event.target.value)}
                            value={newRoom}
                        />
                        <Button type="submit">
                            Criar sala
                        </Button>
                    </form>
                    <p>
                        Quer entrar em uma sala existente? <Link to="../rooms/list">Clique aqui</Link>.
                    </p>
                </div>
            </main>
        </div>
    )
}