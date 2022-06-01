import copyImg from '../assets/images/copy.svg'
import copyDarkImg from '../assets/images/copy-dark.svg'
import '../styles/room-code.scss';
import Swal from 'sweetalert2';

type RoomCodeProps = {
    code: string;
    isDark?: boolean
}

export function RoomCode({isDark = false, ...props}: RoomCodeProps) {

    const Toast = Swal.mixin({
        background: isDark ? 'black' : 'white',
        color: isDark ? 'white' : 'black',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: false,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    function copyRoomCodeToClipboard() {

        Toast.fire({
            icon: 'success',
            title: 'Código copiado.'
        });

        navigator.clipboard.writeText(props.code);
    }

    return (
        <button className={`room-code ${isDark ? 'dark' : ''}`} onClick={copyRoomCodeToClipboard}>
            <div>
                { isDark ? (<img src={copyDarkImg} alt="Copy Code" />) : (<img src={copyImg} alt="Copy Code" />) }
            </div>
            <span>Sala: {props.code}</span>
        </button>
    );
}