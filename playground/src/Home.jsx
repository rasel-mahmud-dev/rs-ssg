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
            <p>Welcome to the home page! ........dsfsdfsdf</p>
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

export async function getStaticPaths() {
    const data = [
        { id: "ssg-super", title: "Item 1", value: "Value 1", link: "https://examples1.com/1" },
        { id: 2, title: "Item 2", value: "Value 2", link: "https://examples1.com/2" },
        { id: 3, title: "Item 3", value: "Value 3", link: "https://examples1.com/3" },
        { id: 4, title: "Item 4", value: "Value 4", link: "https://examples1.com/4" },
        { id: 5, title: "Item 5", value: "Value 5", link: "https://examples1.com/5" },
        { id: 6, title: "Item 6", value: "Value 6", link: "https://examples1.com/6" },
        { id: 7, title: "Item 7", value: "Value 7", link: "https://examples1.com/7" },
        { id: 8, title: "Item 8", value: "Value 8", link: "https://examples1.com/8" },
        { id: 9, title: "Item 9", value: "Value 9", link: "https://examples1.com/9" },
        { id: 10, title: "Item 10", value: "Value 10", link: "https://examples1.com/10" }
    ];
    const paths = data.map((item) => ({
        params: { id: item.id.toString() }
    }));

    return {
        paths,
        props: { data },
        fallback: false
    };
}


export default Home