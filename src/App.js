import React, {useState, useEffect} from "react";
import UserList from "./components/UserList/UserList";
import Pagination from "./components/Pagination/Pagination";
import axios from 'axios';
import './app.css'
function App() {

  const [user, setUser] = useState([])

  const [currentPage, setCurrentPage] = useState(1)
  const [prevPage, setPrevPage] = useState(null)
  const [nextPage, setNextPage] = useState(null)
  const [loading, setLoading] = useState(true)

  function goNextPage(){
    setCurrentPage(nextPage)
  }

  function goPrevPage(){
    setCurrentPage(prevPage)
  }

  function bulkInsert(){
    setLoading(true)
    axios.get('https://randomuser.me/api/?results=12').then(async res =>{
      let users = res.data.results.map(u =>{
        return {
          "email":u.email,
          "first_name": u.name.first,
          "last_name": u.name.last,
          "avatar": u.picture.thumbnail
        }
      })
      users.forEach(async u =>{
        return await axios.post('http://localhost:3001/users/',u)
      })
      setLoading(false)
      window.location.reload(false)
    })
  }

  useEffect(()=>{
    setLoading(true)
    let cancel
    axios.get(`http://localhost:3001/users?page=${currentPage > 0 ? currentPage: 1}&per_page=6`, {
      cancelToken: new axios.CancelToken(c=> cancel = c)
    }).then(res=>{
      setLoading(false)
      setNextPage(res.data.next_page)
      setPrevPage(res.data.prev_page)

      if(res.data.data.length > 0 && currentPage > 0){
        setUser(res.data.data)
      }else if(currentPage > 0){
        setCurrentPage(currentPage-1)
      }
    })

    return ()=> cancel()
  }, [currentPage])

  if (loading) return (
    <div className="loading">
        Loading...
    </div>
  )

  return (
    <>
      <button title="bulk insert" onClick={bulkInsert}>
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
        <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
        <path fillRule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"/>
      </svg>
      </button>
      <UserList user={user} />
      <Pagination nextPage={nextPage?goNextPage:null} prevPage={prevPage?goPrevPage:null}/>
    </>
  );
}

export default App;
