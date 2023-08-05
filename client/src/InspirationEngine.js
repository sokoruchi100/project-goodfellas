import React, {useState} from 'react';
import axios from 'axios';


const InspirationEngine = () => {
    const [vid1, setVid1] = useState("");
    const [vid2, setVid2] = useState("");
    const [vid3, setVid3] = useState("");
    const [vid4, setVid4] = useState("");

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post('http://localhost:5000/inspiration-engine', { vid1, vid2, vid3, vid4 });
            setVid1('');
            setVid2('');
            setVid3('');
            setVid4('');
        }
        catch (error) {
            console.error("Error adding post", error.response?.data || error.message);
        }
    };

    return (
        <div className=''>
            <form onSubmit={handleFormSubmit} className=''>
                <input type='text' placeholder='url' value={vid1} onChange={(e) => setVid1(e.target.value)} required/>
                <input type='text' placeholder='url' value={vid2} onChange={(e) => setVid2(e.target.value)} required/>
                <input type='text' placeholder='url' value={vid3} onChange={(e) => setVid3(e.target.value)} required/>
                <input type='text' placeholder='url' value={vid4} onChange={(e) => setVid4(e.target.value)} required/>
                <button type='submit' className=''>Add</button>
            </form>
        </div>
    );
};

export default InspirationEngine;