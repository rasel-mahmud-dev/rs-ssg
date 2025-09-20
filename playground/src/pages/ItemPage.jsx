import React, { useEffect } from 'react';

function ItemPage(props) {
    // useEffect(() => {
    //     console.log(`Item ${item.id} page mounted`);
    // }, [item.id]);

    console.log(props, "item")

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            {JSON.stringify(props ?? {})}
        </div>
    );
}

export default ItemPage;