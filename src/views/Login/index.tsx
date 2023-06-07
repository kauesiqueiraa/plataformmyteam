import { Dispatch, useState } from 'react';
import Input from '../../components/Input';
import './style.css';
import Button from '../../components/Button';
import ClientAPI from '../../utils/client.api';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateApiKey } from '../../store/actions';

export default function Login() {
    const navigate = useNavigate();
    const dispatch: Dispatch<any> = useDispatch();

    const [key, setKey] = useState("");
    const [loading, setLoading] = useState(false);

    const handleClickLogin = async () => {
        setLoading(true);
        try {
            const client = new ClientAPI(key);
            const result = await client.checkKey();
            if (result) {
                dispatch(updateApiKey(key));
                navigate('/countries');
            } else {
                alert('Invalid Key');
            }
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="login-area">


            <section className="form-area">
                <form action="">
                    <h1>Se você gosta de futebol, essa é a sua plataforma, seja bem vindo ao <span>Meu Time</span></h1>
                    <label htmlFor="">Para acessar digite sua API Key</label>
                    <div className="input">
                        <Input label='Chave da API' value={key} onChange={(value) => setKey(value)} />
                    </div>
                    <a className="signin" href="https://dashboard.api-football.com/login">
                        <p>CRIAR CONTA:</p>
                        <a href="https://dashboard.api-football.com/login">API-FOOTBALL</a>

                    </a>
                    <div className="input-btn">
                        <Button disabled={!key || loading} isLoading={loading} onClick={key ? handleClickLogin : () => { }}>
                            Entrar
                        </Button>
                    </div>
                </form>
            </section>
        </main>
    );
}