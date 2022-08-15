import logo from './logo.svg';
import './App.css';
import {useState} from 'react';

function Header(props){
  // console.log('props', props, props.title)
  return <header>
  <h1><a href="/" onClick={function(e){
    e.preventDefault();
    props.onChangeMode();
  }}>{props.title}</a></h1>
</header>
} //===컴포넌트
//  컴포넌트에 이벤트

// 리액트에서의 속성 : prop
// { } 표현식으로 취급됨

// 이벤트를 가진 컴포넌트

// state ? 컴포넌트를 만드는 내부자를 위한 데이터
// useState 의 인자는 state 의 초기값이다.
// 0번 인덱스를 첫번째 인자로 읽는다
//  바꿀때는 1번 인덱스를 사용한다, setMode();  사용
// 

function Nav(props) {
  const lis = [];
  for(let i = 0 ; i < props.topics.length; i++) {
    let t = props.topics[i];
    lis.push(<li key = {t.id}>
      <a href={'/read/'+t.id} onClick = {function(e){
        e.preventDefault();
        props.onChangeMode(Number(t.id));
      }}>{t.title}</a></li>)
  }
  return <nav>
    <ol>
      {lis}
    </ol>
  </nav>
}

function Create(props){
  return <article>
    <h2>Create</h2>
    <form onSubmit={(event)=>{
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onCreate(title, body);
    }}>
      <p>
      <input type="text" name='title' placeholder='title'/></p>
      <p><textarea name="body" cols="30" rows="10" placeholder='body'></textarea></p>
      <p><input type="submit" value="submit"/></p>
    </form>
  </article>
}

function Article (props) {
  return <article>
    <h2>{props.title}</h2>
    {props.body}
  </article>
}

function Update(props){
    const [title, setTitle] = useState(props.title);
    const [body, setBody] = useState(props.body);
  return <article>
  <h2>Update</h2>
  <form onSubmit={(event)=>{
    event.preventDefault();
    const title = event.target.title.value;
    const body = event.target.body.value;
    props.onUpdate(title, body);
  }}>
    <p>
    <input type="text" name='title' placeholder='title' value={title} onChange={event=>{
      setTitle(event.target.value);
    }}/></p>
    <p><textarea name="body" cols="30" rows="10" placeholder='body' value={body}onChange={event=>{
      setBody(event.target.value);
    }}></textarea></p>
    <p><input type="submit" value="Update"/></p>
  </form>
</article>
}

function App() {
  // const _mode = useState('WELCOME');
  // const mode = _mode[0];
  // const setMode = _mode[1];
  // 아래와 같은 문법
  const [mode, setMode] = useState('WELCOME');
  const [id, setID] = useState(null);
  const [nextId, setNextId] =useState(4);
  const [topics, setTopics] = useState([
    {id : 1, title : 'HTML', body : "HTML is..."},
    {id : 2, title : 'CSS', body : 'CSS is ....'},
    {id : 3, title : 'JavaScript', body : 'JS is .....'}
  ]);
  let content = null;
  let contextControl = null;
  if (mode === 'WELCOME') {
    content = <Article title = "WELCOME" body ="Hello! React!"></Article>
  } else if (mode === 'READ') {
    for (let i = 0; i < topics.length; i++) {
        if(topics[i].id === id){
        let title = topics[i].title;
        let body = topics[i].body;    
        content = <Article title={title} body={body}></Article>
        contextControl = <li><a href={"/update"+id} onClick={event=>{
          event.preventDefault();
          setMode('UPDATE');
        }}>Update</a></li>;
        }
      }
  } else if (mode === 'CREATE') {
    content = <Create onCreate={(_title, _body)=>{
      const newTopic = {id: nextId, title : _title, body : _body};
      const newTopics = [...topics];
      newTopics.push(newTopic);
      setTopics(newTopics);
      setMode('READ');
      setID(nextId);
      setNextId(nextId + 1);
    }
    }></Create>
  } else if (mode === 'UPDATE') {
    for (let i = 0; i < topics.length; i++) {
      if(topics[i].id === id){
      let title = topics[i].title;
      let body = topics[i].body;    
      content = <Article title={title} body={body}></Article>
      contextControl = <><li><a href={"/update"+id} onClick={event=>{
        event.preventDefault();
        setMode('UPDATE');
      }}>Update</a></li>
        <li><input type="button" value="Delete" onClick={()=>{
          let newTopics = [];
            for (let i = 0 ; i < topics.length ; i++) {
              if(topics[i].id !== id) {
                newTopics.push(topics[i]);
              }
            }
            setTopics(newTopics);
            setMode('WELCOME');
        }}/></li>
      </>;
      content = <Update title={title} body={body} onUpdate={(title, body)=>{
        const newTopics = [...topics];
        const updatedTopic = {title : title, body : body, id:id}
        for(let i = 0; i <newTopics.length; i++){
          if(newTopics.id === id){
            newTopics[i] = updatedTopic;
            break;
          }
        }
        setTopics(newTopics);
        setMode('READ');
        setNextId(nextId+1);
      }}></Update>
      }
    }
  }
  return (
    <div>
      <Header title="React" onChangeMode={() => {
        setMode('WELCOME');
      }}></Header>
      <Nav topics={topics} onChangeMode={function(_id){
        setMode('READ');
        setID(_id);
      }}></Nav>
      {content}
      <ul>
        <li><a href="/create" onClick={event => {
        event.preventDefault();
        setMode('CREATE');
       }}>Create</a></li>
      {contextControl}
      </ul>
    </div>
  );
}

export default App;
