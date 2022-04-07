import logo from '../../assets/logo.png';
import { Link } from 'react-router-dom';
import { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/auth';

function SingUp() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { cadastrarUsuario } = useContext(AuthContext);

  function handleSubmit(e) {
    e.preventDefault();
    if (nome !== '' && email !== '' && password !== '') {
      cadastrarUsuario(email, password, nome);
    }
  }
  return (
    <div className='container-center'>
      <div className='login'>
        <div className='logo-area'>
          <img src={logo} alt='' />
        </div>
        <form onSubmit={handleSubmit}>
          <h1>Cadastre sua conta</h1>
          {nome}
          <input
            type='text'
            placeholder='Nome'
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          {email}

          <input
            type='email'
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
          <button>Cadastrar</button>
        </form>
        <Link to='/'>Já tem uma conta? Entre</Link>
      </div>
    </div>
  );
}

export default SingUp;
