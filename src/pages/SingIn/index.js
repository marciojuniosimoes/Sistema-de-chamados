import './singIn.css';
import logo from '../../assets/logo.png';
import { Link } from 'react-router-dom';
import { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/auth';

function SingIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { LogandoUsuario, loadingAuth } = useContext(AuthContext);

  function handleSubmit(e) {
    e.preventDefault();
    if (email !== '' && password !== '') {
      LogandoUsuario(email, password);
    }
  }
  return (
    <div className='container-center'>
      <div className='login'>
        <div className='logo-area'>
          <img src={logo} alt='' />
        </div>
        <form onSubmit={handleSubmit}>
          <h1>Entrar</h1>
          {email}

          <input
            type='emai'
            placeholder='email@email.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {password}
          <input
            type='password'
            placeholder='***********'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type='Submit'>
            {loadingAuth ? 'Carregando....' : 'Acessar'}
          </button>
        </form>
        <Link to='/register'>Criar uma conta</Link>
      </div>
    </div>
  );
}

export default SingIn;
