// offline data
db.enablePersistence()
    .catch(function (err) {
        if (err.code == 'failed-precondition') {
            // Multiple tabs open, persistence can only be enabled
            // in one tab at a a time.
            // ...
            console.log('persistence failed');
        } else if (err.code == 'unimplemented') {
            // The current browser does not support all of the
            // features required to enable persistence
            // ...
            console.log('persistence not available');
        }
    });

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
            removeCoffee(change.doc.id);
        }
    });
})

// adding a new coffee
const form = document.querySelector('form');
form.addEventListener('submit', evt => {
    evt.preventDefault();

    const coffee = {
        name: form.name.value,
        description: form.description.value,
        ingredients: form.ingredients.value
    };

    db.collection('coffee').add(coffee)
        .catch(err => console.log(err));

    form.name.value = '';
    form.description.value = '';
    form.ingredients.value = '';
});

// deleting a coffee
const coffeeContainer = document.querySelector('.coffees');
coffeeContainer.addEventListener('click', evt => {
    // console.log(evt);
    if (evt.target.tagName === 'I') {
        const id = evt.target.getAttribute('data-id');
        db.collection('coffee').doc(id).delete();
    }
});