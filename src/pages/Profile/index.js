import './profile.css';
import Header from '../../componets/Header';
import Title from '../../componets/Title';
import { FiSettings, FiUpload } from 'react-icons/fi';
import avatar from '../../assets/avatar.png';
import { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/auth';
import firebase from '../../services/fireBaseConections';
import { toast } from 'react-toastify';

export default function Profile() {
  const { user, Sair, setUser, storageUser } = useContext(AuthContext);
  const [nome, setNome] = useState(user && user.nome);
  const [email, setEmail] = useState(user && user.email);
  const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
  const [avatarAtualizada, setAvatarAtualizada] = useState(null);

  async function UploadImage() {
    const idAtual = user.uid;
    const uploadTarefa = await firebase
      .storage()
      .ref(`images/${idAtual}/${avatarAtualizada.name}`)
      .put(avatarAtualizada)
      .then(async () => {
        toast.success('Foto Enviada com sucesso');
        await firebase
          .storage()
          .ref(`images/${idAtual}`)
          .child(avatarAtualizada.name)
          .getDownloadURL()
          .then(async (url) => {
            let urlFoto = url;
            await firebase
              .firestore()
              .collection('users')
              .doc(user.uid)
              .update({
                avatarUrl: urlFoto,
                nome: nome,
              })
              .then(() => {
                let data = {
                  ...user,
                  avatarUrl: urlFoto,
                  nome: nome,
                };
                setUser(data);
                storageUser(data);
              });
          });
      });
  }

  function previewImage(e) {
    if (e.target.files[0]) {
      const image = e.target.files[0];
      if (image.type === 'image/jpeg' || image.type === 'image/png') {
        setAvatarAtualizada(image);
        setAvatarUrl(URL.createObjectURL(e.target.files[0]));
      } else {
        alert('Envie uma imagem do tipo PNG ou JPEG');
        setAvatarAtualizada(null);
        return null;
      }
    }
    //console.log(e.target.files[0]);
  }

  async function SalvarAlteracoes(e) {
    e.preventDefault();
    if (avatarAtualizada === null && nome !== '') {
      await firebase
        .firestore()
        .collection('users')
        .doc(user.uid)
        .update({
          nome: nome,
        })
        .then(() => {
          let data = {
            ...user,
            nome: nome,
          };
          setUser(data);
          storageUser(data);
        });
    } else if (nome !== '' && avatarAtualizada !== null) {
      UploadImage();
    }
  }

  return (
    <div>
      <Header />
      <div className='content'>
        <Title name='Meu Perfil'>
          <FiSettings size={25} />
        </Title>
        <div className='container'>
          <form className='form-perfil' onSubmit={SalvarAlteracoes}>
            <label className='imagem-avatar'>
              <span>
                <FiUpload color='#fff' size={25} />
              </span>
              <input type='file' accept='image/*' onChange={previewImage} />{' '}
              <br />
              {avatarUrl === null ? (
                <img src={avatar} width='250' height='250' alt='foto-perfil' />
              ) : (
                <img
                  src={avatarUrl}
                  width='250'
                  height='250'
                  alt='foto-perfil'
                />
              )}
            </label>
            <label>Nome</label>
            <input
              type='text'
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            <label>E-mail</label>
            <input type='email' value={email} disabled={true} />
            <button type='submit'>Salvar</button>
          </form>
        </div>
        <div className='container'>
          <button className='btn-sair' onClick={() => Sair()}>
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}
