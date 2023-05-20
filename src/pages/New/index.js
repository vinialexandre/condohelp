import firebase from '../../services/firebaseConnection'
import { useHistory, useParams } from 'react-router-dom'

import { useState, useEffect, useContext } from 'react';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { AuthContext } from '../../contexts/auth';
import { toast } from 'react-toastify';

import { FiPlusCircle } from 'react-icons/fi'

import './new.css'

export default function New() {
  const {id} = useParams()
  const history = useHistory()

  const [loadCustomers, setLoadcustomers] = useState(true)
  const [customers, setCustomers] = useState([])
  const [customerSelected, setCustomerSelected] = useState(0)

  const [assunto, setAssunto] = useState('Suporte')
  const [status, setStatus] = useState('Aberto')
  const [complemento, setComplemento] = useState('')


  const [idCustomer, setIdCustomer] = useState(false)

  const { user } = useContext(AuthContext);


  useEffect(() => {
    async function loadCustmers() {
      setLoadcustomers(true)
      await firebase.firestore().collection('customers')
        .get()
        .then((snapshot) => {
          let lista = [];

          snapshot.forEach((doc) => {
            lista.push({
              id: doc.id,
              nome: doc.data().nome
            })
          })

          if (lista.length === 0) {
            console.log('NENHUM REGISTRO ENCONTRADO')
            setCustomers([{ id: '1', nome: 'Cadastre Morador na aba Moradores' }])
            setLoadcustomers(false)
            return
          }

          setCustomers(lista)
          setLoadcustomers(false)

          if(id){
            loadId(lista)
          }

        })
        .catch((error) => {
          console.log('Deu algum erro, ERRO!', error)
          setLoadcustomers(false)
          setCustomers([{ id: '1', nome: '' }])
        })
    }

    loadCustmers();

  }, [])


  async function loadId(lista){
    await firebase.firestore().collection('chamados').doc(id)
    .get()
    .then((snapshot)=>{
      setAssunto(snapshot.data().assunto)
      setStatus(snapshot.data().status)
      setComplemento(snapshot.data().complemento)


      let index = lista.findIndex(item => item.id  === snapshot.data().clienteId)
      setCustomerSelected(index)
      setIdCustomer(true)

    })
    .catch((err)=>{
      console.log('ERRO NO ID PASSADO', err)
      setCustomers(false)
    })
  }



  async function handleRegister(e) {
    e.preventDefault();

    if(idCustomer){
      await firebase.firestore().collection('chamados')
      .doc(id)
      .update({
        cliente: customers[customerSelected].nome,
        clienteId: customers[customerSelected].id,
        assunto: assunto,
        status: status,
        complemento: complemento,
        userId: user.uid
      })
      .then(()=>{
        toast.success('Chamado Editado com sucesso')
        setCustomerSelected(0)
        setComplemento('')
        history.push('/dashboard')
      })
      .catch((err)=>{
         toast.error('Ops ERRO ao registrar, tente maia tarde')
         console.log(err)
      })

      return;
    }



    await firebase.firestore().collection('chamados')  
    .add({
      created: new Date(),
      cliente: customers[customerSelected].nome,
      clienteId: customers[customerSelected].id,
      assunto: assunto,
      status: status,
      complemento: complemento,
      userId: user.uid
    })
    .then(()=>{
      toast.success('Chamado criado com sucesso')  
      setComplemento('')
      setCustomerSelected(0)
    })
    .catch((err)=>{
      toast.error('Ops erro ao tentar registrar , tente mais tarde')
      console.log(err)
    })
   
  }

  // Chama quando troca assunto
  function handleChangeSelect(e) {
    setAssunto(e.target.value)
    console.log(e.target.value)
  }

  //Chama quando troca o status
  function handleOptionChange(e) {
    setStatus(e.target.value)

  }
  // chama quando troca de cliente
  function hendleChangeCustomers(e) {
    //console.log('INDEX DO CLIENTE SELECIONADO', e.target.value)
    //console.log('Cliente selecionado', customers[e.target.value])
    setCustomerSelected(e.target.value)
  }



  return (
    <div>
      <Header />

      <div className='content'>
        <Title name='Novo Chamado'>
          <FiPlusCircle size={25} />
        </Title>

        <div className='container'>

          <form className='form-profile' onSubmit={handleRegister}>

            <label>Morador</label>

            <select value={customerSelected} onChange={hendleChangeCustomers}>
              {(loadCustomers) ?
                <option>Carregando ...</option>
                :
                customers.map((item, index) => {
                  return (
                    <option key={item.id} value={index}>
                      {item.nome}
                    </option>
                  )
               })}
            </select>


            <label>Assunto</label>
            <select value={assunto} onChange={handleChangeSelect}>
              <option value='Problemas com manutenção'>Problemas com manutenção</option>
              <option value='Solicitações de reparo'>Solicitações de reparo</option>
              <option value='Segurança'>Segurança</option>
              <option value='Serviços gerais'>Serviços gerais</option>
              <option value='Finanças e contabilidade'>Finanças e contabilidade</option>
              <option value='Comunicação e eventos'>Comunicação e eventos</option>
              <option value='Limpeza e conservação'>Limpeza e conservação</option>
              <option value='Outros assuntos'>Outros assuntos</option>
            </select>

            <label>Status</label>
            <div className='status'>
              <input
                id="aberto"
                type='radio'
                name='radio'
                value='Aberto'
                onChange={handleOptionChange}
                checked={status === 'Aberto'}
              />
              <label htmlFor="aberto">Em Aberto</label>

              <input
                id="Progresso"
                type='radio'
                name='radio'
                value='Progresso'
                onChange={handleOptionChange}
                checked={status === 'Progresso'}
              />
              <label htmlFor="Progresso">Progresso</label>

              <input
                id="atendido"
                type='radio'
                name='radio'
                value='Atendido'
                onChange={handleOptionChange}
                checked={status === 'Atendido'}
              />
              <label htmlFor="atendido">Atendido</label>
            </div>

            <label>Complemento</label>
            <textarea
              type='text'
              placeholder='Descreva seu problema (opcional).'
              value={complemento}
              onChange={(e) => setComplemento(e.target.value)}
            />

            <button type='submit'>Registrar</button>

          </form>

        </div>


      </div>
    </div>
  )
}