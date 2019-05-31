// real-time listener
db.collection('coffee').onSnapshot((snapshot) => {
    // console.log(snapshot.docChanges());

    // log out change and data
    snapshot.docChanges().forEach(change => {
        // console.log(change, change.doc.data(), change.doc.id);

        if (change.type === 'added') {
            // add the document data to the web app

            renderCoffee(change.doc.data(), change.doc.id);

        } else if (change.type === 'removed') {
            // remove the document data from the web app

        }
    });


})