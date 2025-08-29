
import React, { useEffect, useState } from 'react';

const API = localStorage.getItem('API') || 'http://localhost:4000';

export default function App(){
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [authForm, setAuthForm] = useState({ name:'', email:'', password:'' });
  const authed = !!token;

  useEffect(() => { if (authed) loadTasks(); }, [token]);

  async function req(path, method='GET', body){
    const res = await fetch(`${API}${path}`, {
      method,
      headers: { 'Content-Type':'application/json', ...(token?{'Authorization':`Bearer ${token}`}:{}) },
      body: body?JSON.stringify(body):undefined
    });
    if (!res.ok) throw new Error((await res.json()).message || 'Error');
    return res.json();
  }

  async function register(){
    const data = await req('/api/auth/register','POST',authForm);
    setToken(data.token); localStorage.setItem('token', data.token); setUser(data.user);
  }
  async function login(){
    const {email,password} = authForm;
    const data = await req('/api/auth/login','POST',{email,password});
    setToken(data.token); localStorage.setItem('token', data.token); setUser(data.user);
  }
  function logout(){
    setToken(''); localStorage.removeItem('token'); setUser(null); setTasks([]);
  }

  async function loadTasks(){ setTasks(await req('/api/tasks')); }
  async function addTask(){
    if(!title.trim()) return;
    const t = await req('/api/tasks','POST',{title});
    setTasks([t,...tasks]); setTitle('');
  }
  async function toggleTask(t){
    const u = await req(`/api/tasks/${t._id}`,'PATCH',{completed:!t.completed});
    setTasks(tasks.map(x => x._id===u._id?u:x));
  }
  async function delTask(id){
    await req(`/api/tasks/${id}`,'DELETE');
    setTasks(tasks.filter(x => x._id!==id));
  }

  return (
    <div className="wrap">
      <h1>Task Manager</h1>
      {!authed ? (
        <div>
          <p className="muted">Set backend URL (optional):</p>
          <div className="row">
            <input placeholder="http://localhost:4000" defaultValue={API}
              onBlur={e=>{localStorage.setItem('API', e.target.value); location.reload();}} />
          </div>
          <h3>Register</h3>
          <div className="row">
            <input placeholder="Name" onChange={e=>setAuthForm({...authForm,name:e.target.value})}/>
            <input placeholder="Email" onChange={e=>setAuthForm({...authForm,email:e.target.value})}/>
            <input placeholder="Password" type="password" onChange={e=>setAuthForm({...authForm,password:e.target.value})}/>
            <button onClick={register}>Sign up</button>
          </div>
          <h3>Login</h3>
          <div className="row">
            <input placeholder="Email" onChange={e=>setAuthForm({...authForm,email:e.target.value})}/>
            <input placeholder="Password" type="password" onChange={e=>setAuthForm({...authForm,password:e.target.value})}/>
            <button onClick={login}>Login</button>
          </div>
        </div>
      ) : (
        <div>
          <div className="row">
            <input placeholder="New task..." value={title} onChange={e=>setTitle(e.target.value)} />
            <button onClick={addTask}>Add</button>
            <button className="danger" onClick={logout}>Logout</button>
          </div>
          <ul>
            {tasks.map(t => (
              <li key={t._id}>
                <span className="muted">{new Date(t.createdAt).toLocaleString()}</span>
                <span style={{flex:1, marginLeft:12, textDecoration: t.completed?'line-through':'none'}}>{t.title}</span>
                <div className="row">
                  <button onClick={()=>toggleTask(t)}>{t.completed?'Undo':'Done'}</button>
                  <button className="danger" onClick={()=>delTask(t._id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      <p className="muted">Tip: pin this repo on your GitHub profile.</p>
    </div>
  );
}
