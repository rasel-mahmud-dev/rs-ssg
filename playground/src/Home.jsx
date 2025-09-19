import React, {useEffect} from 'react';

function Home() {
    const [count, setCount] = React.useState(0);

    useEffect(() => {
        console.log("Home mounted")
    }, [])

    function  fetchData() {
        console.log("jisdafdsf")
    }


    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h1>Home Page</h1>
            <p>Welcome to the home page!</p>
            <p>Counter: {count}</p>
            <button onClick={fetchData}>fetchData</button>
            <button 
                onClick={() => setCount(count + 1)}
                style={{ padding: '10px 20px', fontSize: '16px' }}
            >
                Increment
            </button>
            <div>
                <h2>Features:</h2>
                <ul>
                    <li>React Hooks</li>
                    <li>Interactive Counter</li>
                    <li>Modern JavaScript</li>
                </ul>
            </div>
        </div>
    );
}


export default Home