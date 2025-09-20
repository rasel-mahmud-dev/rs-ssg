import React, {useEffect} from 'react';

const Home = () => {

    useEffect(() => {
        console.log("Home component mounted");
    }, []);

    return (
        <div>
            <h1 className="home-title">Home </h1>
            <h1>Home </h1>
            <h1>Home </h1>
            <h1>Home </h1>
            <h1>Home </h1>
            <h1>Home </h1>
            <h1>Home </h1>
            <h1>Home </h1>
            <button onClick={() => alert("hi")}>Alert</button>
        </div>
    );
};

export default Home;