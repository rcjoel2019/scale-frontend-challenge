import React from 'react'
import './userlist.css'
export default function UserList({user}) {
    return (
        <div>
            {
                user.map(u =>(
                    <div key={u.id}>
                        <div className="row" >
                            <img src={u.avatar} alt="avatar"/>
                            <div className="info">
                                <p>Name: {`${u.first_name} ${u.last_name}`}</p>
                                <p>Email: {u.email}</p><br/>
                            </div>
                        
                        </div>
                        <hr></hr>
                    </div>
                ))
            }
        </div>
    )
}
