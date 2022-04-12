import './customers.css';
import Header from '../../componets/Header';
import Title from '../../componets/Title';
import { FiUser } from 'react-icons/fi';
import firebase from 'firebase';
import { toast } from 'react-toastify';
import { useState } from 'react';

export default function Clientes() {
  const [nomeCliente, setNomeCliente] = useState('');
  const [cnpj, setCpnj] = useState('');
  const [endereco, setEndereco] = useState('');

  async function CadastrarCliente(e) {
    e.preventDefault();
    if (nomeCliente !== '' && cnpj !== '' && endereco !== '') {
      await firebase
        .firestore()
        .collection('clientes')
        .add({
          nomeCliente: nomeCliente,
          cnpj: cnpj,
          endereco: endereco,
        })
        .then(() => {
          setNomeCliente('');
          setCpnj('');
          setEndereco('');
          toast.info('Cliente Cadastrado com Sucesso!!');
        })
        .catch((error) => {
          console.log(error);
          toast.error('Erro ao cadastrar cliente');
        });
    } else {
      toast.error('preencha todos os campos');
    }
  }

  return (
    <div>
      <Header />
      <div className='content'>
        <Title name='Clientes' size={25}>
          <FiUser size={25} />
        </Title>
        <div className='container'>
          <form className='form-perfil' onSubmit={CadastrarCliente}>
            <label>Nome do Cliente</label>
            <input
              placeholder='Nome do Cliente'
              type='text'
              value={nomeCliente}
              onChange={(e) => setNomeCliente(e.target.value)}
            />
            <label> CNPJ</label>
            <input
              placeholder='Número do CNPJ'
              type='text'
              value={cnpj}
              onChange={(e) => setCpnj(e.target.value)}
            />
            <label>Endereço</label>
            <input
              placeholder='Endereço'
              type='text'
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
            />
            <button type='submit'>Salvar</button>
          </form>
        </div>
      </div>
    </div>
  );
}
