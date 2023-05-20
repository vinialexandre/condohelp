import { useState } from 'react';
import './customers.css';
import Title from '../../components/Title';
import Header from '../../components/Header';
import firebase from '../../services/firebaseConnection';
import { FiUser } from 'react-icons/fi'

import { toast } from 'react-toastify'

export default function Customers(){
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('') 
  const [endereco, setEndereco] = useState('');


  async function hendleAdd(e){
    e.preventDefault();
    
    if(nome !== '' && cpf !== '' && endereco !== ''){
      await firebase.firestore().collection('customers')
      .add({
        nome: nome,
        cpf: cpf,
        endereco: endereco
      })
      .then(()=>{
        setNome('')
        setCpf('')
        setEndereco('')
        toast.info('Registro cadastrado com sucesso')
      })
      .catch((error)=>{
        console.log(error)
        toast.error('Erro ao cadastrar esse registro')
      })
    }else{
      toast.error('Preencha todos os campos')
    }


  }



  return(
    <div>
       <Header/>
    <div className='content'>
      <Title name='Moradores'>
        <FiUser size={25}/>
      </Title>


      <div className='container'>
        <form className='form-profile customers' onSubmit={hendleAdd}>
           <label>Nome</label>
           <input type='text' placeholder ='Nome' value={nome} onChange={ (e) => setNome(e.target.value) }/>

           <label>Cpf</label>
           <input type='text' placeholder ='Seu Cpf' value={cpf} onChange={ (e) => setCpf(e.target.value) }/>

           <label>Endereço</label>
           
           <input type='text' placeholder ='Endereço' value={endereco} onChange={ (e) => setEndereco(e.target.value) }/>

          <button type='submit'>Cadastrar</button>

        </form>
      </div>
    </div>   

    </div>
  )
}