import React, { useState } from 'react';
import { Button } from './button';
import '../../styles/global.css';
import './style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faEdit, faTrashAlt, faKey } from '@fortawesome/free-solid-svg-icons';
import { profiler } from '../../services/users/profileUser';
import { deleteUser } from '../../services/users/profileDelete';

interface UserState {
  value: string;
  editing: boolean;
}

interface User {
  name: UserState;
  password: UserState;
  city: UserState;
  state: UserState;
}

export const CrudUser = ({ accessToken }: { accessToken: string }) => {
  const [user, setUser] = useState<User>({
    name: { value: 'João', editing: false },
    password: { value: '', editing: false },
    city: { value: '', editing: false },
    state: { value: '', editing: false },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setUser({
      ...user,
      [field]: { ...user[field], value: e.target.value }
    });
  };

  const handleEditClick = (field: string) => {
    setUser({
      ...user,
      [field]: { ...user[field], editing: true }
    });
  };

  const handleSaveEdit = () => {
    const { name, password } = user;
    profiler(name.value, password.value)
      .then((data) => {
        const token = data.token;
        localStorage.setItem('token', token);

        setUser(prevUser => ({
          ...prevUser,
          name: { ...prevUser.name, editing: false },
          password: { ...prevUser.password, editing: false },
          city: { ...prevUser.city, editing: false },
          state: { ...prevUser.state, editing: false },
        }));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDeleteUser = () => {
    deleteUser(accessToken)
      .then((data) => {
        localStorage.removeItem('token');
        setUser({
          name: { value: '', editing: false },
          password: { value: '', editing: false },
          city: { value: '', editing: false },
          state: { value: '', editing: false },
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className='profile-container'>
      <div className='input-container'>
        <h1>Perfil Usuário</h1>
        <label>Nome</label>
        <div className='icon-input'>
          <FontAwesomeIcon icon={faUserCircle} style={{ color: '#d3d3d3' }} size='2x' className='icon' />
          <input
            id='name'
            type='text'
            value={user.name.value}
            onChange={(e) => handleInputChange(e, 'name')}
            disabled={!user.name.editing}
            className='input'
            placeholder='Nome'
          />
          <FontAwesomeIcon
            icon={faEdit}
            style={{ color: '#d3d3d3', cursor: 'pointer', marginLeft: '1rem' }}
            size='2x'
            className='icon'
            onClick={() => handleEditClick('name')}
          />
        </div>

        <label>Cidade</label>
        <div className='icon-input'>
          <input
            id='city'
            type='text'
            value={user.city.value}
            onChange={(e) => handleInputChange(e, 'city')}
            disabled={!user.city.editing}
            className='input'
            placeholder='Cidade'
          />
          <FontAwesomeIcon
            icon={faEdit}
            style={{ color: '#d3d3d3', cursor: 'pointer', marginLeft: '1rem' }}
            size='2x'
            className='icon'
            onClick={() => handleEditClick('city')}
          />
        </div>

        <label>Estado</label>
        <div className='icon-input'>
          <input
            id='state'
            type='text'
            value={user.state.value}
            onChange={(e) => handleInputChange(e, 'state')}
            disabled={!user.state.editing}
            className='input'
            placeholder='Estado'
          />
          <FontAwesomeIcon
            icon={faEdit}
            style={{ color: '#d3d3d3', cursor: 'pointer', marginLeft: '1rem' }}
            size='2x'
            className='icon'
            onClick={() => handleEditClick('state')}
          />
        </div>

        <label>Senha</label>
        <div className='icon-input'>
          <FontAwesomeIcon icon={faKey} style={{ color: '#d3d3d3' }} size='2x' className='icon' />
          <input
            type='password'
            value={user.password.value}
            onChange={(e) => handleInputChange(e, 'password')}
            disabled={!user.password.editing}
            placeholder='Senha'
            className='input'
          />
          <FontAwesomeIcon
            icon={faEdit}
            style={{ color: '#d3d3d3', cursor: 'pointer', marginLeft: '1rem' }}
            size='2x'
            className='icon'
            onClick={() => handleEditClick('password')}
          />
        </div>
      </div>

      <div className='style-button'>
        <Button onClick={handleSaveEdit}>Salvar Alterações</Button>
        <span style={{ margin: '0 30px' }}></span>
        <Button onClick={handleDeleteUser}>
          <FontAwesomeIcon icon={faTrashAlt} style={{ marginRight: '0.5rem' }} />
          Deletar Conta
        </Button>
      </div>
    </div>
  );
};
